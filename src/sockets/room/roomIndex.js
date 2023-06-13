// Event Handling
const createRoomHandler = require('./roomEventListeners/createRoomListener');
const joinRoomHandler = require('./roomEventListeners/joinRoomListener');
const setColorHandler = require('./roomEventListeners/setColorListener');
const getColorHandler = require('./roomEventListeners/getColorListener');
const isInRoomHandler = require('./roomEventListeners/isInRoomListener');
const startGameHandler = require('./roomEventListeners/startGameListener');
const getPlayerHandler = require('./roomEventListeners/getPlayersListener');
const changeGameHandler = require('./roomEventListeners/changeGameListener');
const changingGameHandler = require('./roomEventListeners/changingGameListener');
const closeRoomHandler = require('./roomEventListeners/closeRoomListener');
const leaveRoomHandler = require('./roomEventListeners/leaveRoomListener');
const disconnectingHandler = require('./roomEventListeners/disconnectingListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on("room:create", (data, callback) => createRoomHandler(io, socket, data, callback));
  socket.on("room:join", (data, callback) => joinRoomHandler(io, socket, data, callback));

  socket.on("room:set-color", (data, callback) => setColorHandler(io, socket, data, callback));
  socket.on("room:get-color-selector", () => getColorHandler(socket));

  socket.on("room:is-in-room", (callback) => isInRoomHandler(socket, callback));

  socket.on("room:start-game", (callback) => startGameHandler(io, socket, callback));
  socket.on("room:get-players", (callback) => getPlayerHandler(socket, callback));

  socket.on("room:change-game", () => changeGameHandler(io, socket));
  socket.on("room:changing-game", (data) => changingGameHandler(io, socket, data));
  socket.on("room:close-room", () => closeRoomHandler(io, socket));

  socket.on("room:leave-room", () => leaveRoomHandler(io, socket));
  socket.on("disconnect", () => disconnectingHandler(io, socket));
}