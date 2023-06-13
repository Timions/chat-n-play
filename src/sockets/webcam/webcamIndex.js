const joinedEvent = require('./webcamEventListeners/joinedListener');
const webcamDisable = require('./webcamEventListeners/disableWebcam');
const webcamEnable =  require('./webcamEventListeners/enableWebcam');
const webcamMute = require('./webcamEventListeners/muteMic');
const webcamUnmute = require('./webcamEventListeners/unmuteMic');

module.exports = (io, socket) => {

  // Socket.io Events
  socket.on('webcam:joined', (data) => joinedEvent(io, socket, data));

  socket.on("webcam:disable", () => webcamDisable(io,socket));

  socket.on("webcam:enable", () => webcamEnable(io,socket));

  socket.on("webcam:muteMic", () => webcamMute(io,socket));

  socket.on("webcam:unmuteMic", () => webcamUnmute(io,socket));
}