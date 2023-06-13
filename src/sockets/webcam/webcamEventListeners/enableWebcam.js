const { getPlayer, getPlayersInRoom } = require("../../../models/players");

module.exports = (io, socket) => {
    const player = getPlayer(socket.id);
    console.log("sssss");
    if(player === undefined) return;

    player.hasVideo = true;

    console.log(":...");
    console.log(player);

    io.to(player.socketId).emit("webcam:enabled");
    
    // allen Spielern die neuen Spieler senden
    const players = getPlayersInRoom(player.roomId).map((player) => {
        let playerObj = { socketId: player.socketId, username: player.username, position: player.position, color: player.color, isMuted: player.isMuted, hasVideo: player.hasVideo };
        
        return playerObj;
    });

    // bei allen anderen Spielern die Spieler updaten
    io.to(player.roomId).emit('room:update', { players });
}
