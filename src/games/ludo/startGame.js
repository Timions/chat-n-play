const {getPlayersInRoom, setFirstPlayer} = require('../../models/players.js');
const { getRoom } = require('../../models/rooms.js');
const { addDice } = require('./Dice.js');

const dices = [];

const startGameLudo = (roomId) => {

    const allPlayers = getPlayersInRoom(roomId);

    // Spielern weitere Attribute hinzufügen 
    // (Startfeld, Positionen der Spielfiguren, Poitionen Haus, zuletzt gewürfelte Augenzahl)
    allPlayers.forEach(player => {
        switch (player.position) {
            case 0:
                player['start'] = 31;
                player['playerPosition'] = [[113, null], [114, null],[115, null], [116, null]];
                player['house'] = [[113, true], [114, true], [115, true], [116, true]];
                player['dicecount'] = 0;
                break;
            case 1:
                player['start'] = 11;
                player['playerPosition'] = [[105, null], [106, null],[107, null], [108, null]];
                player['house'] = [[105, true], [106, true], [107, true], [108, true]];
                player['dicecount'] = 0;
                break;
            case 2:
                player['start'] = 1;
                player['playerPosition'] = [[101, null], [102, null],[103, null], [104, null]];
                player['house'] = [[101, true], [102, true], [103, true], [104, true]];
                player['dicecount'] = 0;
                break;
            case 3:
                player['start'] = 21;
                player['playerPosition'] = [[109, null], [110, null],[111, null], [112, null]];
                player['house'] = [[109, true], [110, true], [111, true], [112, true]];
                player['dicecount'] = 0;
                break;
          }
    });

    // Raum einen Würfel hinzufügen
    addDice(roomId);

    room = getRoom(roomId);
    
    // 0 : Spiel hat noch nicht begonnen, 1: Spiel hat begonnen, 2: Spiel ist vorbei
    room['gameStatus'] = 0

}

module.exports = {startGameLudo};