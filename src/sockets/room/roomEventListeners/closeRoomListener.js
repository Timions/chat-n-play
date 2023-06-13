const { isHost, removeRoom } = require('../../../models/rooms');
const { getPlayer, getPlayersInRoom, removePlayer } = require('../../../models/players');

module.exports = (io, socket) => {
    const player = getPlayer(socket.id);

    // Spieler exestiert
    if(player !== undefined) {
        let players = getPlayersInRoom(player.roomId);

        // Ob Spieler Host ist
        if(isHost(player.socketId)) {

            // Spieler disconnecten + löschen
            for(let p of players) {
                removePlayer(p.socketId);
                io.sockets.sockets.get(p.socketId).leave(player.roomId);

                // Socket miteilen, dass man sich nicht mehr im Raum befindet
                io.to(p.socketId).emit('room:room-closed');

            }

            // Raum löschen
            removeRoom(player.roomId);
        }
    }
}