const { getPlayer, nextPlayerInRoom} = require('../../../models/players');
const {moveFigure, throwFigure, checkWinner} = require ('../../../games/ludo/gamelogic.js');
const { getRoom } = require('../../../models/rooms');
const { getDiceValue } = require('../../../games/ludo/Dice');

module.exports = (io, socket, id) => {

    const player = getPlayer(socket.id);

    const newPosition = moveFigure(id, player);
    const throwFig = throwFigure(newPosition, player);
    const winner = checkWinner(player);
    const room = getRoom(player.roomId);
    const dice = getDiceValue(player.roomId);

    if(winner){
        room.gameStatus = 2;
        const winners = [player];
        io.in(player.roomId).emit('room:end-game', { winners: winners });
    }

    if(getDiceValue(player.roomId) !== 6){
        player.dicecount = 0;
        const nextPlayer = nextPlayerInRoom(player.roomId, player);
        io.in(player.roomId).emit('ludo:nextPlayer', nextPlayer);
        io.to(nextPlayer.socketId).emit("ludo:unlockDice", nextPlayer);

    }else{
        io.to(player.socketId).emit("ludo:unlockDice", player);

    }

    const res = [newPosition, player.color, id, player.position, dice];

    io.in(player.roomId).emit('ludo:moveFigure', res);

    if(throwFig.length > 0){
        io.in(player.roomId).emit('ludo:throwFigure', {throwFig, dice});
    }

}