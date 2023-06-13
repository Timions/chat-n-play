const { getPlayer } = require("../../../models/players");

module.exports = (io, socket) => {
    const player = getPlayer(socket.id);

    io.to(player.socketId).emit("webcam:start");
    
}
