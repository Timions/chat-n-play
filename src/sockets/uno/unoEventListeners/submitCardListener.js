const { getPlayer, getPlayersInRoom } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { setNextPlayer, dealCard } = require("../../../games/uno/gameLogic");

module.exports = (io, socket, data) => {
    
    // aktuellen Spieler bekommen
    const player = getPlayer(socket.id);

    // Spieler exestiert noch nicht
    if(player === undefined) return;

    // aktuellen Raum bekommen
    const room = getRoom(player.roomId);

    // Raum exestiert nicht
    if(room === undefined) return;

    // Falsches Spiel
    if(room.gameTypeId !== 1) return;

    // Noch nicht gestartet
    if(room.hasStarted === false) return;

    // Spiel noch nicht angefangen
    if(room.cardOnBoard === 0) return; 

    // Wenn man auf die Farbwahl wartet => keine Karten ziehen
    if(room.moveType === 5 || room.moveType === 6) return; 

    // Wenn man auf Klopf Input warten => keine Karten ziehen
    if(room.moveType === 7 || room.moveType === 8) return;

    // Fall keine Karte übergeben wurde
    if(data.card === undefined) return;

    const placeCard = (card) => {

        if(player.active === false) return;

        // Spieler kann nicht mehr interagieren
        player.active = false;

        const isSpecial = (card) => {
            if(card.color === 4) {
                return true;
            }
    
            if(card.value > 9) {
                return true;
            }
    
            return false;
        }
        
        // Besondere Karte
        if(isSpecial(card)) {

            // +2 Karte
            if(card.value === 10) {
                room.cardsCount += 2;
                room.moveType = 2;
                console.log("played +2 Card");
                
            // Reverse Karte
            } else if(card.value === 11) {
                room.isReverse = !room.isReverse;

                console.log("played reverse Card");

                // Bei 2 Spielern wie eine Aussetzkarte
                let playersLen = getPlayersInRoom(room.roomId).length;

                if(playersLen === 2) {
                    room.isSkip = true;
                }

                room.moveType = 1;

            // Aussetz Karte
            } else if(card.value === 12) {
                console.log("played - Card");
                room.isSkip = true;
                room.moveType = 1;

            // Schwarze Farbe
            } else {

                console.log("played special Card");

                // +4
                if(card.value === 0) {
                    room.cardsCount += 4;
                    room.moveType = 5;

                // Farbe aussuchen
                } else if(card.value === 1) {
                    room.moveType = 6;
                    
                // Klopf Karte
                } else if(card.value === 2) {
                    room.moveType = 7;

                }

            }

        // Normaler Karte
        } else {
            console.log("played normal Card");
            room.moveType = 1;

        }

        player.hand.discard(card);
        room.cardOnBoard = card;

        io.to(room.roomId).emit('uno:card-played', { card: card, socketId: player.socketId });

        setTimeout(() => {

            // Wenn ein Spieler keine Karten mehr hat => gewonnen
            if (player.hand.getHandSize() === 0) {
                io.in(player.roomId).emit('room:end-game', { winners: [player] });
                console.log("player has won game");

            // Spieler hat noch nicht gewonnen
            } else {

                // Ob man vergessen hat 'KlopfKlopf' zu sagen / zu drücken
                if(player.hand.getHandSize() === 1) {

                    console.log("one card left");

                    // Wurde vergessen => +1 Karte ziehen
                    if(!player.klopfKlopf) {
                        console.log("klopf klopf vergessen");
                        dealCard(io, room, player, false);

                    } else {
                        
                        // resetten
                        player.klopfKlopf = false;
                    }

                } else {
                    // Wenn man fälschlicherweise KlopfKlopf Drück => resetten
                    if(player.klopfKlopf) {
                        console.log("klopf vergessen"),
                        dealCard(io, room, player, false);

                        // resetten
                        player.klopfKlopf = false;
                    }
                }

                // Auf Farb Input warten
                if(room.moveType === 5 || room.moveType === 6) {
                    socket.emit('uno:get-color');
                    console.log("Farb Input warten");

                // Auf Klopf Input warten
                } else if(room.moveType === 7 || room.moveType === 8) {
                    socket.emit('uno:get-klopf');
                    console.log("Klopf Input warten");

                // Nächster Spieler ist dran
                } else {
                    console.log("setting new Player");
                    setNextPlayer(io, room.roomId);
                }
            }
        }, 1000);
    }

    // Spieler ist gerade dran
    if(room.activePlayer.socketId === player.socketId) {

        // Ob man überhaupt die Karte besitzt
        if(player.hand.hasCard(data.card.id) === false) return;

        // Normaler Zug
        if(room.moveType === 1) {

            // Wenn sich eine farbe gewünscht wurde
            if(room.customColor === true) {

                // Schwarze Karte unten (von disconnect event)
                if(room.nextColor === 4) {
                    room.customColor = false;
                    room.nextColor = -1;

                    placeCard(data.card);

                } else {
                    // Karte schwarz oder gewünschte Farbe -> Darf gelegt werden
                    if(room.nextColor === data.card.color || data.card.color === 4) {
                        room.customColor = false;
                        room.nextColor = -1;

                        placeCard(data.card);
                    }
                }

            // Es wurde sich keine farbe gewünscht
            } else {

                // Gleiche Farbe oder gleiche Zahl
                if(room.cardOnBoard.value === data.card.value || room.cardOnBoard.color === data.card.color || data.card.color === 4) {
                    placeCard(data.card);
                }

            }

        // +2 Karte zuletzt gelegt
        } else if(room.moveType === 2) {

            // Wenn sich eine farbe gewünscht wurde
            if(room.customColor === true) {

                // Man selber muss auch eine +2 oder +4 Karte legen
                if(data.card.value === 10 && data.card.color === room.nextColor|| (data.card.color === 4 && data.card.value === 0 )) {
                    room.customColor = false;
                    room.nextColor = -1;
                    
                    placeCard(data.card);
                }

            } else {
                // Man selber muss auch eine +2 oder +4 Karte legen
                if(data.card.value === 10 || (data.card.color === 4 && data.card.value === 0 )) {
                    placeCard(data.card);
                }
            }

        // +4 Karte zuletzt gelegt
        } else if(room.moveType === 3) {

            // Schwarze Karte unten (von disconnect event)
            if(room.nextColor === 4) {

                // Eine weitere +4 Karte
                if(data.card.color === 4 && data.card.value === 0 ||
                    // +2 Karte in beliebiger Farbe
                    data.card.value === 10) {
                        
                    room.customColor = false;
                    room.nextColor = -1;
    
                    placeCard(data.card);
                }

            } else {
                // Eine weitere +4 Karte
                if(data.card.color === 4 && data.card.value === 0 ||
                    // +2 Karte in der gewünschten Farbe
                    data.card.value === 10 && data.card.color === room.nextColor) {

                    room.customColor = false;
                    room.nextColor = -1;
                    
                    placeCard(data.card);
                }
            }            

        // Klopf Klopf Karte zuletzt gelegt
        } else if(room.moveType === 4) {
            placeCard(data.card);
        }

    // Spieler ist gerade nicht dran
    } else {

        // Exakt gleiche Karte
        if(room.cardOnBoard.value === data.card.value && room.cardOnBoard.color === data.card.color) {

            // Alten Spieler inaktiv setzten
            let oldPlayer = getPlayer(room.activePlayer.socketId);
            oldPlayer.active = false;

            // Neuen aktiven Spieler setzten
            room.activePlayer = { socketId: player.socketId, position: player.position };
            player.active = true;
            
            placeCard(data.card);
        }

    }
}