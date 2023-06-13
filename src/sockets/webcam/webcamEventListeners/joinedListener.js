const { getPlayer } = require("../../../models/players");

module.exports = (io, socket, data) => {
    const player = getPlayer(socket.id);

    if(player !== undefined) {
        socket.to(player.roomId).emit('webcam:user-joined', { peerId: data.peerId, socketId: socket.id });
    }
}
