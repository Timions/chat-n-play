const { isHost, getRoom } = require('../../../models/rooms');
const { getPlayer, getPlayersInRoom } = require('../../../models/players');

module.exports = (io, socket) => {
    const player = getPlayer(socket.id);

    // Spieler exestiert
    if(player === undefined) return;

    // Ob Spieler Host ist
    if(!isHost(player.socketId)) return;

    // Raum hohlen
    let room = getRoom(player.roomId);

    if(room === undefined) return;

    // Event emitten
    io.in(player.roomId).emit('room:change-game');
}