const { getPlayer } = require('../../../models/players');
const { getRoom } = require('../../../models/rooms');

module.exports = (io, socket, callback) => {

    // Spieler bekommen
    const player = getPlayer(socket.id);
    if(player === undefined) return;

    // Raum bekommen
    const room = getRoom(player.roomId);
    if(room === undefined) return;

    // Ob Runde gestoppt werden kann
    if(room.gameStatus !== 1) return;
    room.gameStatus = 2;

    // Event Emitten
    io.in(player.roomId).emit('slf:round-stopped');
}