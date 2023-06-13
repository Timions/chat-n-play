const { getHost } = require('../../../models/rooms');
const { getPlayer, getPlayersInRoom } = require('../../../models/players');

module.exports = (socket, callback) => {
    const player = getPlayer(socket.id);

    // allen Spielern die neuen Spieler senden
    let mappedPlayers = getPlayersInRoom(player.roomId).map((player) => {
        let playerObj = { socketId: player.socketId, username: player.username, position: player.position, color: player.color };
        
        return playerObj;
    });

    const hostId = getHost(player.roomId);

    callback({ players: mappedPlayers, hostId });
}