const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { submitVotes, calculateScore } = require("../../../games/slf/gameLogic");

module.exports = (io, socket, data, callback) => {

    const player = getPlayer(socket.id);

    if(player !== undefined) {
        let lastSubmit = submitVotes(player, data.results, (data) => {
            io.in(player.roomId).emit('slf:players-ready-count', { playersReady:  data.readyPlayers });
            
        });

        // Letzter hat die Bewertung abgegeben => Punkte berechnen
        if(lastSubmit) {

            // Runde vorbei -> umleiten
            io.in(player.roomId).emit('slf:round-over');

            const room = getRoom(player.roomId);
            const scores = calculateScore(room);

            // Scores an Spieler senden
            io.in(player.roomId).emit('slf:round-scores', { scores });
        }
    }
}