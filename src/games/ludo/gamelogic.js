const {getPlayersInRoom} = require('../../models/players.js');

//Überprüfen ob mind. eine Figur im Haus ist
checkHouse = (currentPlayer) => {
    for(let i = 0; i < 4; i ++){
        if(currentPlayer.house[i][1] === true){
            return true;
        }
    return false;
    }
}

//Überprüfen ob eine eigene Spielfigur auf dem Feld steht
checkField = (position, currentPlayer) => {
    for (let i = 0; i < 4; i ++){
        if(currentPlayer.playerPosition[i][0] === position){
            return true;
        }else{
        }
    }
    return false;
}

showMove = (dice, position, currentPlayer) => {
    let newPosition = position;

    for(let i = 0; i < dice; i ++){
        if (newPosition === 40 && currentPlayer.position === 2){
            newPosition = 201;
        }else if (newPosition === 10 && currentPlayer.position === 1){
            newPosition = 205;
        }else if (newPosition === 20 && currentPlayer.position === 3){
            newPosition = 209;
        }else if (newPosition === 30 && currentPlayer.position === 0){
            newPosition = 213;
        }else if (newPosition === 40){
            newPosition = 1;
        }else if(newPosition === 204 || newPosition === 208 || newPosition === 212 || newPosition === 216){
            newPosition = null; 
            break;
        }else{
            newPosition = newPosition +1;
        }
    }

    //überprüfen, ob eigene Figur auf dem Zielfeld steht
    if(checkField(newPosition, currentPlayer)){
        newPosition = null;
    }

    for (let i = 0; i < 4 ; i ++){
        if(currentPlayer.playerPosition[i][0] === position){
            currentPlayer.playerPosition[i][1] = newPosition;
            break;
        }
    }
    //möglichen Spielzug für die Spielfigur berechnen und potentielles Zielfeld anzeigen
}

showFigureFromHouse = (currentPlayer) => {
    let pos = [];
    for(let i = 3; i >= 0; i --){
        if (currentPlayer.house[i][1] === true){
            const position = currentPlayer.house[i][0];
            for (let j = 0; j < 4; j ++){
                if (currentPlayer.playerPosition[j][0] === position){
                    pos[0] = currentPlayer.playerPosition[j][0];
                    currentPlayer.playerPosition[j][0] = currentPlayer.start;
                    pos[1] = currentPlayer.start;
                    currentPlayer.house[i][1] = false;
                    pos[2] = currentPlayer.color;
                    return pos;
                }
            }  
        }
    }
    // eine Figur aus dem Haus auf das Startfeld
    return pos;
}

moveFigure = (id, currentPlayer) => {
    let buttonid = null;
    for (let i = 0; i < 4 ; i ++){
        if(currentPlayer.playerPosition[i][0] == id){
            buttonid = currentPlayer.playerPosition[i][1];
            currentPlayer.playerPosition[i][0] = buttonid;
        }
        currentPlayer.playerPosition[i][1] = null;
    }
    return buttonid;
}

throwFigure = (position, currentPlayer) => {

    const allPlayers = getPlayersInRoom(currentPlayer.roomId);

    let pos = []

    allPlayers.forEach(player => {
        if(player !== currentPlayer){
            for( let i = 0; i < 4; i ++){
                if(player.playerPosition[i][0] == position){
                    const housePos = getFirstPosHole(player.house);
                    if(housePos > -1){
                        player.playerPosition[i][0] = housePos;
                        pos.push(housePos, player.color);
                    }
                }
            }
        }
    });
    return pos;
}

getFirstPosHole = (house) => {
    housePos = -1;
    house.find(pos => {
        if(pos[1]!== true){
            pos[1] = true;
            housePos = pos[0];
            return housePos;
        };
        });
    return housePos;
}

checkWinner = (player) => {
    for (let i = 0; i < 4; i ++){
        if(player.playerPosition[i][0] <= 200){
            return false;
        }
    }
    return true;
}

onField = (positions) => {
    for( let i = 0; i < 4; i ++){
        if(positions[i][0] <= 40){
            return false;
        }
    }

    return true;
}

walkInHouse = (player) => {
    for( let i = 0; i < 4; i ++){
        
        if(player.playerPosition[i][0] > 200){
            let newPosition = player.playerPosition[i][0];

            if(newPosition === 204 || newPosition === 208 || newPosition === 212 || newPosition === 216){
                newPosition = null; 
                break;
            }else{
                newPosition = newPosition +1;
            }
        
            //überprüfen, ob eigene Figur auf dem Zielfeld steht
            if(checkField(newPosition, player)){
                newPosition = null;
            }

            if(newPosition !== null){
                return false;
            }
        }
    }

    return true;
}

module.exports = {checkField, checkHouse, showMove, showFigureFromHouse, moveFigure, getFirstPosHole, throwFigure, checkWinner, onField, walkInHouse};