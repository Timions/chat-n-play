const sendMessageHandler = require('./chatEventListener/sendMessageListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on("chat:sendMessage", (data) => sendMessageHandler(io, socket, data));
}