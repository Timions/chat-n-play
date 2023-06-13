// Event Handling
const submitCardHandler = require('./unoEventListeners/submitCardListener');
const drawCardHandler = require('./unoEventListeners/drawCardListener');
const klopfKlopfHandler = require('./unoEventListeners/klopfKlopfListener');
const setColorHandler = require('./unoEventListeners/setColorListener');
const setKlopfHandler = require('./unoEventListeners/setKlopfListener');
const endTurnHandler = require('./unoEventListeners/endTurnListener');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on('uno:submit-card', (data) => submitCardHandler(io, socket, data));

  socket.on('uno:draw-card', () => drawCardHandler(io, socket));

  socket.on('uno:klopf-klopf', () => klopfKlopfHandler(io, socket));

  socket.on('uno:set-color', (data) => setColorHandler(io, socket, data));

  socket.on('uno:set-klopf', (data) => setKlopfHandler(io, socket, data));

  socket.on('uno:end-turn', () => endTurnHandler(io, socket));
}