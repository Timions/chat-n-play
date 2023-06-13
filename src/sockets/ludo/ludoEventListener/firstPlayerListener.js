const { getPlayer, getCurrentPlayerInRoom, getPlayersInRoom } = require('../../../models/players');
const { getRoom } = require('../../../models/rooms');


module.exports = (io, socket, mode) => {

    let game_mode = true;

    if(mode.mode === "Nein"){
        game_mode = false;
    }

    const player = getPlayer(socket.id);
    const allPlayers = getPlayersInRoom(player.roomId);

    io.in(player.roomId).emit('ludo:showMatchfield');

    //ersten Spieler festlegen
    const index = Math.floor(Math.random()*allPlayers.length);
    allPlayers[index].active = true;

    const firstPlayer = getCurrentPlayerInRoom(player.roomId);
    
    const room = getRoom(player.roomId);
    room.gameStatus = 1;
    room["mode"] = game_mode;

    io.in(player.roomId).emit('ludo:first-player', firstPlayer);
    io.to(firstPlayer.socketId).emit('ludo:unlockDice-firstPlayer');
}