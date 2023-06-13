

const changeMode = require('./footerEventListener/changePathListener')

module.exports = (io, socket) => {


    // Socket.io Events
    socket.on('footer:faq', () => changeMode(io, socket, 'faq/'));

    socket.on('footer:aboutus', () => changeMode(io, socket, 'aboutus/'));

    socket.on('footer:privacypolicy', () => changeMode(io, socket, 'privacypolicy/'));

    socket.on('footer:start', () => changeMode(io, socket, ''))
  
  }