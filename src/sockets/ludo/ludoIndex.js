const ludoHandler = require('./ludoEventListener/rollLudoListener');
const moveHandler= require('./ludoEventListener/moveLudoListener');
const firstPlayerHandler = require('./ludoEventListener/firstPlayerListener');
const changeMode = require('./ludoEventListener/changeModeListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on('ludo:changeMode', (data) => changeMode(io, socket, data));

  socket.on('ludo:firstPlayer', (data) => firstPlayerHandler(io, socket, data));

  socket.on("ludo:rollDice", () => ludoHandler(io, socket));

  socket.on('ludo:clickFigure', (id) => moveHandler(io, socket, id));
}