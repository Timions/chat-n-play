const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { dealCard } = require("../../../games/uno/gameLogic");

module.exports = (io, socket) => {

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

    // Spiel noch nicht angefangen
    if(room.cardOnBoard === 0) return;

    // Nur einmal pro Zug   
    if(!player.klopfKlopf) {

        player.klopfKlopf = true;
        io.to(room.roomId).emit('uno:has-last-card', { socketId: socket.id });  
    }
}