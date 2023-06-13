const { getPlayer } = require('../../../models/players');

module.exports = (io, socket, data) => {

    if(data.text.length > 0) {
        const player = getPlayer(socket.id);
        
        if(player !== undefined) {
            io.in(player.roomId).emit('chat:message', { socketId: socket.id, username: player.username, text: data.text, color: player.color });
        }
    }
}
