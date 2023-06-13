// Event Handling
const startGameHandler = require('./slfEventListeners/startGameListener');
const stopRoundHandler = require('./slfEventListeners/stopRoundListener');
const submitWordsHandler = require('./slfEventListeners/submitWordsListener');
const submitVotesHandler  = require('./slfEventListeners/submitVotesListener');
const newRoundHandler  = require('./slfEventListeners/newRoundListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on('slf:start-game', (data, callback) => startGameHandler(io, socket, data, callback));

  socket.on('slf:stop-round', (callback) => stopRoundHandler(io, socket, callback));

  socket.on('slf:submit-words', (data, callback) => submitWordsHandler(io, socket, data, callback));

  socket.on('slf:submit-votes', (data, callback) => submitVotesHandler(io, socket, data, callback));

  socket.on('slf:vote-new-round', (data, callback) => newRoundHandler(io, socket, data, callback));
}