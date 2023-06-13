const { getPlayer } = require("../../../models/players");

module.exports = (io, socket, mode) => {

    const player = getPlayer(socket.id);

    io.in(player.roomId).emit('ludo:mode', mode.mode);

}