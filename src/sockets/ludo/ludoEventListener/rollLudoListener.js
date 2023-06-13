const { roll, getDiceValue } = require('../../../games/ludo/Dice');
const { getPlayer,  nextPlayerInRoom, getCurrentPlayerInRoom} = require('../../../models/players');
const {checkField, checkHouse, showMove, showFigureFromHouse, throwFigure, onField, walkInHouse} = require ('../../../games/ludo/gamelogic.js');
const { getRoom } = require('../../../models/rooms');

module.exports = (io, socket) => {

    const player = getPlayer(socket.id);
    const room = getRoom(player.roomId);
    
    roll(player.roomId);

    const dicedValue = getDiceValue(player.roomId);
    io.in(player.roomId).emit('ludo:dicedValue', dicedValue);

    // wägt Sonderfälle ab und berechnet mögliche Züge
    if(checkHouse(player)){
        if(checkField(player.start, player)){
            showMove(getDiceValue(player.roomId), player.start, player);
            for (let i = 0; i < 4; i ++){
                if(player.playerPosition[i][0] == player.start && player.playerPosition[i][1] == null){
                    callShowMoves(player);
                }
            }
        }else if(getDiceValue(player.roomId) === 6){
            const pos = showFigureFromHouse(player);
            const throwFig = throwFigure(player.start, player);
            io.in(player.roomId).emit('ludo:leaveHouse', pos);
            io.to(player.socketId).emit("ludo:unlockDice");
            if(throwFig.length > 0){
                io.in(player.roomId).emit('ludo:throwFigure', throwFig);
            }
            return;
        }else{
            callShowMoves(player)
        }
    }else{
        callShowMoves(player)
    }

    // berechnet die Züge für alle übrigen Spielfiguren
    let count = 0;
    let res = [];
    let figures = [];

    for(let i = 0; i < 4; i ++){
        if(player.playerPosition[i][1]!= null){
            let id = player.playerPosition[i][1];
            let figure = player.playerPosition[i][0];
            res.push(id);
            figures.push(figure);
            count ++;
        }
    }
    
    if(room.mode && res.length > 0){
        io.in(player.roomId).emit('ludo:showMoves', {res: res, color: player.color});
    }
    
    if(figures.length > 0){
        io.to(player.socketId).emit("ludo:unlockMoveFields", figures);
    }

    if(res.length === 0){
        if(getDiceValue(player.roomId) === 6){
            io.to(player.socketId).emit("ludo:unlockDice", player);
        }else if(player.dicecount < 2 && onField(player.playerPosition) && walkInHouse(player)){
            io.to(player.socketId).emit("ludo:unlockDice", player);
            player.dicecount += 1;
        }else{
            player.dicecount = 0;
            const nextPlayer = nextPlayerInRoom(player.roomId, player);
            io.in(player.roomId).emit('ludo:nextPlayer', nextPlayer);
            io.to(nextPlayer.socketId).emit("ludo:unlockDice", nextPlayer);
        }
    }
}

callShowMoves = (player) =>{ 
    for(let i = 0; i < 4; i++){
        if(player.playerPosition[i][0]<= 40 ||player.playerPosition[i][0]>= 200){
            showMove(getDiceValue(player.roomId), player.playerPosition[i][0], player);
        }
    }
}

