const roomEvents = require("./room/roomIndex");
const webcamEvents = require("./webcam/webcamIndex")
const chatEvents = require("./chat/chatIndex");
const ludoEvents = require("./ludo/ludoIndex")
const unoEvents = require("./uno/unoIndex")
const slfEvents = require("./slf/slfIndex")
const footerEvents = require("./footer/footerIndex")

module.exports = function(io) {

    /**
     * Socket.io onConnection Event
     * @param {*} socket Der Socket, der die Verbindung aufbaut.
     */
    const onConnection = (socket) => {
        
        // all room events
        roomEvents(io, socket);

        // all webcam events
        webcamEvents(io, socket);

        // all chat events
        chatEvents(io, socket);

        // all ludo events
        ludoEvents(io, socket);

        // all slf events
        unoEvents(io, socket);

        // all slf events
        slfEvents(io, socket);

        // all footer event
        footerEvents(io, socket);
    }
    
    // Hören auf das Connection Event
    io.on("connection", onConnection);
}



  