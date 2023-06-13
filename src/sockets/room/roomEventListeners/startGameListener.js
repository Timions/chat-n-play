const { getRoom, isHost, setGameStarted } = require('../../../models/rooms');
const { getPlayersInRoom, getPlayer, setColor, getColors } = require('../../../models/players');
const { startGameLudo } = require('../../../games/ludo/startGame');
const { initUno } = require('../../../games/uno/gameLogic');

module.exports = (io, socket, callback) => {
    
    // Farben setzten, bei denen, die noch keine Farbe ausgesucht haben
    const player = getPlayer(socket.id);

    // Spiler darf kein Spiel starten
    if(player === undefined) {
        return callback("Du darfst kein Spiel starten!");
    }

    const allPlayers = getPlayersInRoom(player.roomId);

    if(allPlayers.length < 2) return callback('Es müssen mindestens 2 Spielende anwesend sein!');

    if(!isHost(socket.id)) return callback('Nur der*die Host kann ein Spiel starten.');

    const colors = getColors(player.roomId);
    const availableColors = colors.filter((color) => color.socketId === undefined);

    for(p of allPlayers) {

        // Farbe wurde noch nicht ausgesucht
        if(p.color === undefined) {

            // Zufällige Farbe auswählen
            var rndIndex = Math.floor(Math.random() * availableColors.length);

            // Farbe setzten
            setColor(p.socketId, availableColors[rndIndex].color);

            // Ausgwählte Farbe von den verfügbaren streichen
            availableColors.splice(rndIndex, 1);
        }
    }

    const players = getPlayersInRoom(player.roomId);

    io.in(player.roomId).emit('room:update', { players });
    io.in(player.roomId).emit('room:update-color-selector', { colors: getColors(player.roomId) });


    // Spiel starten
    const room = getRoom(player.roomId);
    const gameTypeId = room.gameTypeId;

    // Mensch Ärger dich nicht
    if(gameTypeId == 0) {

        // Spieler nach Mensch Ärger dich nicht umleiten (Route angeben)
        io.in(room.roomId).emit('room:game-started', { route: '/ludo/' + room.roomId });

        // Spielstatus setzten
        setGameStarted(room.roomId, true);

        // Start Mehode vom Spiel aufrufen
        startGameLudo(player.roomId);

    } else if(gameTypeId == 1) {
        // Spieler nach Stadt, Land, Fluss umleiten (Route angeben)
        io.in(room.roomId).emit('room:game-started', { route: '/uno/' + room.roomId });

        // Spielstatus setzten
        setGameStarted(room.roomId, true);

        // Start Mehode vom Spiel aufrufen
        initUno(player.socketId, socket, io);

    } else if(gameTypeId == 2) {
        // Spieler nach Stadt, Land, Fluss umleiten (Route angeben)
        io.in(room.roomId).emit('room:game-started', { route: '/slf/' + room.roomId });

        // Spielstatus setzten
        setGameStarted(room.roomId, true);

    } else {
        return callback("Spiel exestiert noch nicht!");

    }

    callback();

}