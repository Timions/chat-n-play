const { isHost, getRoom } = require('../../../models/rooms');
const { getPlayer, getPlayersInRoom } = require('../../../models/players');

module.exports = (io, socket, data) => {
    const player = getPlayer(socket.id);

    // Spieler exestiert
    if(player === undefined) return;

    // Ob Spieler Host ist
    if(!isHost(player.socketId)) return;

    // Raum hohlen
    let room = getRoom(player.roomId);

    if(room === undefined) return;

    room.gameTypeId = data.gameTypeId;
    room.hasStarted = false;

    Object.keys(room).forEach(function(item) {
        if(item !== 'roomId' &&
            item !== 'gameTypeId' &&
            item !== 'hostId' &&
            item !== 'maxPlayers' &&
            item !== 'hasStarted') {
                delete room[item];
        }
    });

    // Spieler resetten
    let players = getPlayersInRoom(room.roomId);

    for(let player of players) {

        Object.keys(player).forEach(function(item) {
            if(item !== 'socketId' &&
                item !== 'username' &&
                item !== 'roomId' &&
                item !== 'position' &&
                item !== 'color' &&
                item !== 'active' &&
                item !== 'hasVideo' &&
                item !== 'isMuted') {
                    delete player[item];
            }
        });
    }

    io.in(player.roomId).emit('room:game-changed', { gameTypeId: data.gameTypeId, roomId: room.roomId, hostId: room.hostId, players });
}