module.exports = (io, socket, mode) => {
    io.in(socket.id).emit('footer:change', { route: '/' + mode});

}