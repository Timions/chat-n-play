const uuid = require('uuid');

/**
 * Raum Object.
 * @typedef {Object} Room
 * @property {String} roomId - Die RaumId des Raums.
 * @property {Number} gameTypeId - Die Id des Spiels.
 * @property {String} hostId - Die SocketId des Hosts.
 * @property {number} maxPlayers - Die maximale Anzahl an Spielern.
 * @property {boolean} hasStarted - Ob das Spiel schon angefangen hat.
 */

/**
 * @namespace
 */
const rooms = [];

/**
 * Fügt einen Raum hinzu.
 * @memberof rooms
 * @param {Number} gameTypeId Die SpielId des Spiels, welches im Raum gespielt werden soll.
 * @param {String} hostId Die SocketId von dem Spieler der den Raum erstellt hat bzw. nach dem disconnect
 * des ursprünglichen Hosts, die SocketId eines zufälligen Spielers.
 * @returns {Room} Das erstellte Raumobjekt.
 */
const addRoom = ( gameTypeId, hostId ) => {
    let roomId = uuid.v4();

    // falls es zufälligerweise schon die gleiche ID gibt
    while (rooms.find((room) => room.roomId === roomId)) {
        roomId = uuid.v4();
    }

    // adding room
    const room = { roomId, gameTypeId, hostId, maxPlayers: 4, hasStarted: false };
    rooms.push(room);
 
    // returning room object
    return room;
}
 
/**
 * Löscht einen Raum.
 * @memberof rooms
 * @param {String} roomId Die RaumId des zu löschenden Raums.
 * @returns {Room} Das gelöschte Raumobjekt.
 */
const removeRoom = (roomId) => {
    const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

    if(roomIndex != -1) {
        const room = rooms[roomIndex];
        rooms.splice(roomIndex, 1)

        return room;
    }

    return false;
}

/**
 * Liefert den zur RaumId passenden Raum zurück.
 * @memberof rooms
 * @param {String} roomId Die RaumId des Raums.
 * @returns {Room} Das gefundene Raumobjekt.
 */
const getRoom = (roomId) => {
    return rooms.find((room) => room.roomId === roomId);
}

/**
 * Prüft ob ein Spieler der Host eines beliebigen Raumes ist.
 * @memberof rooms
 * @param {String} socketId Die SocketId des zu prüfenden Spielers.
 * @returns {Boolean} true: der Spieler ist ein Host eines Raums / false: der Spieler ist kein Host.
 */
const isHost = (socketId) => { 
    let room = rooms.find((room) => room.hostId === socketId);
    return (room === undefined) ? false : true;
}

/**
 * Den Host eines bestimmten Raums bekommen.
 * @memberof rooms
 * @param {String} roomId Die RaumId des Raums.
 * @returns {String} Die SocketId des Hosts.
 */
const getHost = (roomId) => { 
    let room = rooms.find((room) => room.roomId === roomId);
    return room.hostId;
}

/**
 * Setzt einen neues Host für einen Raum.
 * @memberof rooms
 * @param {String} roomId Die RaumId des Raums.
 * @param {String} hostId Die SocketId des neuen Hosts.
 */
const setHost = (roomId, hostId) => { 
    let roomIndex = rooms.findIndex((room) => room.roomId === roomId);
    rooms[roomIndex].hostId = hostId;
}
 
/**
 * Setzt eine Variable ob das Spiel in einem Raum angefangen hat oder nicht.
 * @memberof rooms
 * @param {String} roomId Die RaumId des Raums
 * @param {Boolean} hasStarted true: das Spiel fängt an / false: das Spiel hört auf
 */
const setGameStarted = (roomId, hasStarted) => { 
    let roomIndex = rooms.findIndex((room) => room.roomId === roomId);
    rooms[roomIndex].hasStarted = hasStarted;
}

module.exports = { addRoom, removeRoom, getRoom, isHost, getHost, setHost, setGameStarted };