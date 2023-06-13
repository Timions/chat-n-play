const { removeRoom, isHost, setHost, getRoom } = require('../../../models/rooms');
const { removePlayer, getPlayersInRoom, getColors, reorderPlayerPositions, getCurrentPlayerInRoom, nextPlayerInRoom } = require('../../../models/players');
const { removePlayerWordsFromCurrentRound, checkAllSubmitted, calculateScore, chooseLetter, getPlayersScores } = require('../../../games/slf/gameLogic');

module.exports = (io, socket) => {

    console.log("room-event-listener");

    // Spieler löschen
    const player = removePlayer(socket.id);

    // Spieler exestiert nicht
    if(player === undefined) {
        return;
    }

    const players = getPlayersInRoom(player.roomId);

    // Socket ist letzter Spieler im Raum -> Raum löschen
    if(players == 0) {
        removeRoom(player.roomId);

    // Spieler ist nicht letzte Spiele rim Raum -> Nachricht
    } else {

        // Die Positionen nur dann neu ordnen, wenn das Spiel noch nicht angfangen hat
        let room = getRoom(player.roomId);

        if(!room.hasStarted) {
            reorderPlayerPositions(room.roomId);
        }
        
        socket.to(player.roomId).emit('chat:message', { username: '', text: `${player.username} hat das Spiel verlassen!` });

        // Wenn der Spieler der aktuelle Host des Raums ist => Host neu bestimmen
        if(isHost(player.socketId)) {
            // neuen host setzten
            const newHost = getRandomItem(players);
            setHost(newHost.roomId, newHost.socketId);

            // Sends a message to all clients, that the host has changed
            const newHostSocket = io.of("/").sockets.get(newHost.socketId);

            newHostSocket.to(newHost.roomId).emit('chat:message', { username: '', text: `${newHost.username} ist der neue Host des Spiels!` });
            newHostSocket.emit('chat:message', { username: '', text: 'Du bist der neue Host des Spiels!' });

            // extra Event
            io.in(newHost.roomId).emit("room:hostChanged", { hostId: newHost.socketId});

        }

        // allen Spielern die neuen Spieler senden
        let mappedPlayers = getPlayersInRoom(player.roomId).map((player) => {
            let playerObj = { socketId: player.socketId, username: player.username, position: player.position, color: player.color, isMuted: player.isMuted, hasVideo: player.hasVideo };
            
            return playerObj;
        });

        // Aktuelles Spiel ist Stadt Land Fluss
        if(room.gameTypeId === 2) {

            // Stadt Land Fluss befindet sich gerade in der Bewertungs Phase der Wörter
            // -> Wörter nochmal neu schicken ohne die vom Spieler, der dass Spiel verlassen hat
            if(room.gameStatus === 2) {
                const newWords = removePlayerWordsFromCurrentRound(player);

                // neue Wörter schicken
                io.in(player.roomId).emit('slf:update-words', { words: newWords });

                // schauen ob alle die Wörter abgebgenen haben und nur auf den Spieler gewartet haben, der disconnected ist
                let readyPlayersIndex = room.readyPlayers.findIndex(socketId => socketId === player.socketId);

                if(readyPlayersIndex !== -1) {
                    room.readyPlayers.splice(readyPlayersIndex, 1);
                    io.in(player.roomId).emit('slf:players-ready-count', { playersReady: room.readyPlayers });
                }

                // Letzter hat die Bewertung abgegeben => Punkte berechnen
                if(room.readyPlayers.length === players.length) {
                    // Runde vorbei -> umleiten
                    io.in(player.roomId).emit('slf:round-over');

                    addVotes(room);
                    const scores = calculateScore(room);

                    // resetten
                    io.in(player.roomId).emit('slf:players-ready-count', { playersReady: [] })

                    // Scores an Spieler senden
                    io.in(player.roomId).emit('slf:round-scores', { scores });

                }
            
            // Score Übersicht
            } else if(room.gameStatus === 3) {

                // aus Liste löschen
                let readyPlayersIndex = room.readyPlayers.findIndex(socketId => socketId === player.socketId);

                if(readyPlayersIndex !== -1) {
                    room.readyPlayers.splice(readyPlayersIndex, 1);
                    io.in(player.roomId).emit('slf:players-ready-count', { playersReady: room.readyPlayers });
                }

                // Alle Spiele rschon bereit bis auf der Spieler, der das Spiel verlässt.
                if(room.readyPlayers.length === players.length) {

                    // resetten
                    io.in(player.roomId).emit('slf:players-ready-count', { playersReady: [] })
                    
                    // Noch einer Runde
                    if(room.currentRound < room.rounds) {

                        // Spielern sagen, dass eine neue Runde beginnt
                        room.currentRound += 1;
                        io.in(player.roomId).emit('slf:new-round', { currentRound: room.currentRound });

                        // Punkte zum gesamtscore hinzufügen
                        for(let p of players) {
                            p.score += p.lastScore;
                            p.lastScore = 0;
                        }

                        // Scores emitten
                        io.in(player.roomId).emit('room:score-update', { scores: getPlayersScores(players) });

                        // Buchstabe schicken
                        chooseLetter(room.roomId, (letter) => {
                            io.in(player.roomId).emit('slf:start-round', { letter });
                        });

                    // Alle Runden vorbei
                    } else {

                        // Punkte zum gesamtscore hinzufügen
                        for(let p of players) {
                            p.score += p.lastScore;
                            p.lastScore = 0;
                        }

                        // Scores emitten
                        io.in(player.roomId).emit('room:end-game', { winners: getPlayersScores(players).filter(p => p.rank === 1) });

                    }
                }
            }

        // Aktuelles Spiel ist Mensch-Ärgere-Dich-Nicht
        }else if(room.gameTypeId === 0 && room.gameStatus === 1){

            // wenn der Spieler aktuell am Zug war, wird der nächste Spieler festgelegt
            if(player.active === true){
                const nextPlayer = nextPlayerInRoom(player.roomId, player);
                io.in(player.roomId).emit('ludo:nextPlayer', nextPlayer);
            }

            // nur den aktuellen Spieler wird der Würfel freigeschaltet
            const currentPlayer = getCurrentPlayerInRoom(player.roomId);
            io.to(currentPlayer.socketId).emit("ludo:unlockDice", currentPlayer);
            
            // Spielfiguren des verlassenden Spielers löschen
            io.in(player.roomId).emit('ludo:playerLeave', player.playerPosition);
            
        // Aktuelles Spiel ist Uno
        } else if(room.gameTypeId === 2) {

            // Wenn das Spiel schon gestartet hat
            if(room.hasStarted) {

                // Wenn der Active Spieler noch nicht defined ist
                if(room.activePlayer !== undefined) {

                    // Wenn der Spieler der gerade am Zug ist disconnected -> Nächsten Spieler suchen
                    if(room.activePlayer.socketId === socket.id) {

                        setNextPlayer(io, room.roomId);

                        // Wenn Farb Input erwartet
                        if(room.moveType === 5) {
                            room.moveType = 3;

                            room.customColor = true;
                            room.nextColor = 4;

                        // Wenn Farb Input erwartet (+4 Karte)
                        } else if(room.moveType === 6) {
                            room.moveType = 1;

                            room.customColor = true;
                            room.nextColor = 4;

                        // Klopf Input warten (Spieler 1)
                        } else if(room.moveType === 7) {
                            room.moveType = 4;

                        // Klopf Input warten (Spieler 2)
                        } else if(room.moveType === 8) {

                            setTimeout(() => {
                                io.to(room.activePlayer.socketId).emit('uno:get-klopf');
                            }, 400);
                        }
                    }
                }
            }
        }

        io.in(player.roomId).emit('room:update', { players: mappedPlayers });
        io.in(player.roomId).emit('room:update-color-selector', { colors: getColors(player.roomId) });
    }

    // Spieler aus dem Socket.io Raum rauswerfen
    socket.leave(player.roomId);
}

// selects a random host
const getRandomItem = (arr) => {

    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];

    return item;
}