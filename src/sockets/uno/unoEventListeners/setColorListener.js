const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { setNextPlayer } = require("../../../games/uno/gameLogic");

module.exports = (io, socket, data) => {

    // aktuellen Spieler bekommen
    const player = getPlayer(socket.id);

    // Spieler exestiert noch nicht
    if(player === undefined) return;

    // aktuellen Raum bekommen
    const room = getRoom(player.roomId);

    // Raum exestiert nicht
    if(room === undefined) return;

    // Falsches Spiel
    if(room.gameTypeId !== 1) return;

    // Noch nicht gestartet
    if(room.hasStarted === false) return;
    
    // Spieler nicht an der Reihe
    if(room.activePlayer.socketId !== socket.id) return;

    // Wenn Farb Input nicht erwartet wird
    if(room.moveType !== 5 && room.moveType !== 6) return;
    
    // Ausgesuchte Farbe setzten
    room.nextColor = data.color;
    
    // Speichern dass eine Farbe ausgesucht wurde
    room.customColor = true;
    
    io.in(room.roomId).emit('uno:color-selected', { color: data.color, mode: room.moveType });

    // Bei +4 Karte
    if(room.moveType === 5) {
        room.moveType = 3;

    // Bei Farb Auswahl Karte
    } else {
        room.moveType = 1;

    }

    // Nächsten Spieler setzten
    setNextPlayer(io, room.roomId);
}