const { getPlayer, getPlayersInRoom } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { chooseLetter, getPlayersScores } = require("../../../games/slf/gameLogic");

module.exports = (io, socket, data, callback) => {

    const player = getPlayer(socket.id);

    if(player !== undefined) {
        const room = getRoom(player.roomId);

        if(room === undefined) return;

        // Spieler noch nicht abgegeben
        if(room.readyPlayers.find(p => p.socketId === player.socketId) === undefined) {
            room.readyPlayers.push(player.socketId);
            
            // Spieler zeigen, dass ein Spieler fertig ist
            io.in(player.roomId).emit('slf:players-ready-count', { playersReady: room.readyPlayers });

            const players = getPlayersInRoom(room.roomId);

            if(players === undefined) return;

            // Alle Spieler sind fertig
            if(room.readyPlayers.length === players.length) {

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
    }
}