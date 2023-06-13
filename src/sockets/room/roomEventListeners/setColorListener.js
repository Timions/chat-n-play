const { getPlayersInRoom, getPlayer, setColor, getColors } = require('../../../models/players');

module.exports = (io, socket, data, callback) => {

    const player = getPlayer(socket.id);

    // Spieler exestiert nicht
    if(player === undefined) {
        return callback("Du darfst keine Farbe setzten.");
    }

    // schauen ob man die Farbe wählen darf
    if(!setColor(socket.id, data.color)) return callback("Die Farbe darf nicht gewählt werden.");

    // allen Spieler mit den neuen Farben bekommen
    let mappedPlayers = getPlayersInRoom(player.roomId).map((player) => {
        let playerObj = { socketId: player.socketId, username: player.username, position: player.position, color: player.color, isMuted: player.isMuted, hasVideo: player.hasVideo };
        
        return playerObj;
    });

    // Spieler updaten für die neuen Farben
    io.in(player.roomId).emit('room:update', { players: mappedPlayers });

    // Farben updaten für Farbauswahl
    io.in(player.roomId).emit('room:update-color-selector', { colors: getColors(player.roomId) });

    return callback();
}