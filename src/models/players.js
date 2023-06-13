/**
 * Spieler Object.
 * @typedef {Object} Player
 * @property {String} socketId - Die SockeId des Spielers.
 * @property {Number} username - Der Benutzername des Spielers.
 * @property {String} roomId - Die Raum Id des Raumes, indem sich der Spieler befindet.
 * @property {number} position - Die Position des Spielers auf dem Spielfeld.
 * @property {boolean} color - Die Farbe des Spielers.
 * @property {boolean} active - Ob ein Spieler dran is.
 * @property {boolean} hasVideo - Ob der Spieler seine Video Kamera eingeschaltet hat.
 * @property {boolean} isMuted - Ob der Spieler gemutet ist.
 */

/**
 * @namespace
 */
const players = [];

/**
 * Ein Array aller verfügbaren Farben.
 */
const colors = ['#0B97F0', '#FCA701', '#00BF02', '#FF3030'];

/**
 * Fügt einen Spieler hinzu.
 * @memberof players
 * @param {String} socketId SocketId des Spielers, der hinzugefügt werden soll.
 * @param {String} username Der Benutzername der hinzugefügt werden soll.
 * @param {String} roomId Die RaumId, des Raumes, den der Spieler beitreten will.
 * @returns {Player} Das erzeugte Spieler Objekt oder eine Error Message.
 */
const addPlayer = ( socketId, username, roomId ) => {
    const existingPlayer = players.find((player) => player.roomId === roomId && player.username === username);

    // username or RoomId missing
    if(existingPlayer) return { error: 'Der angegebene Username ist schon in Verwendung.' };

    // get players position. Wenn 2 Spieler bereits im Spiel sind, soll er die position 2 bekommen. (start bei 0)
    let position = getPlayersInRoom(roomId).length;
    
    // adding player
    const player = { socketId, username, roomId, position, color: undefined, active: false, hasVideo: false, isMuted: true };
    players.push(player);

    // returning player object
    return { player };
}
 
/**
 * Löscht einen Spieler anhand seiner SocketId.
 * @memberof players
 * @param {String} socketId Die SocketId des Spielers.
 * @returns {Player} Das Spieler Object, des gelöschten Spielers.
 */
const removePlayer = (socketId) => {
    const playerIndex = players.findIndex((player) => player.socketId === socketId);

    if(playerIndex != -1) {
        const player = players[playerIndex];
        players.splice(playerIndex, 1)
        
        return player;
    }

    return false;
}


/**
 * Das Spielerobjekt anhand seiner SocketId bekommen.
 * @memberof players
 * @param {String} socketId Die SocketId des Spielers.
 * @returns {Player} Das Spieler Objekt.
 */
const getPlayer = (socketId) => { 
    return players.find((player) => player.socketId === socketId);
}


/**
 * Liefert die Spieler Objekte zurück aller Spieler in einem angegebenen Raum.
 * @memberof players
 * @param {String} roomId Die RaumId des Raumes.
 * @returns {Player[]} Alle Spielerobjekte als Array.
 */
const getPlayersInRoom = (roomId) => {
    let playersInRoom = players.filter((player) => player.roomId == roomId);

    return playersInRoom.sort(function(a, b) {
        return a.position - b.position;
    });
}

/**
 * Liefert den Spieler zurück, der zurzeit am zug ist bei Turn Based Games.
 * @memberof players
 * @param {String} roomId Die RaumId des Raumes.
 * @returns {Player} Das Spielerobjekt des aktuellen Spielers.
 */
const getCurrentPlayerInRoom = (roomId) => {
    const allPlayers = getPlayersInRoom(roomId);
    let currentPlayer = null;

    allPlayers.forEach(p => {
        if(p.active == true){
            currentPlayer = p;
        }
    });

    return currentPlayer;
}

/**
 * Gibt den Spieler zurück, der als nächstes an der Reihe ist.
 * @memberof players
 * @param {String} roomId Die RaumId des Raums.
 * @param {Player} currentPlayer Die aktuelle Spieler.
 * @returns {Player} Die nächste Spieler.
 */
const nextPlayerInRoom = (roomId, currentPlayer) => {
    const allPlayers = getPlayersInRoom(roomId);
    currentPlayer.active = false;

    let position = currentPlayer.position;
    let next = false;
    let nextPlayer = null;

    while(next === false){
        switch(position){
            case 0:
                position = 2;
                break;
            case 1: 
                position = 3;
                break;
            case 2:
                position = 1;
                break;
            case 3: 
                position = 0;
                break;
        }

        allPlayers.forEach(p => {
            if(p.position == position){
                next = true; 
                p.active = true;
                nextPlayer = p;
            }
        })
    }

    return nextPlayer;
}

/**
 * Setzt die Farbe eines Spielers.
 * @memberof players
 * @param {String} socketId Die SocketId des Spielers.
 * @param {String} color Die neue Farbe des Spielers.
 * @returns {Boolean} Returnt einen boolean. True: Die Farbe konnte gesetzt werden / False: Die Farbe konnte ncht gestezt werden.
 */
const setColor = (socketId, color) => {
    let player = getPlayer(socketId);
    let colorArr = getColors(player.roomId);

    let colorObj = colorArr.find((obj) => obj.color == color);

    // Man selber hat die Farbe schon ausgewählt -> Farbe löschen
    if(colorObj.socketId == socketId) {
        let index = players.findIndex((p) => p.socketId === socketId);
        players[index].color = undefined;

        return true;

    // Die Farbe ist noch von niemanden ausgewählt worden -> Farbe setzten
    } else if(colorObj.socketId === undefined) {

        // Farbe für den Spieler setzen
        let index = players.findIndex((p) => p.socketId === socketId);
        players[index].color = color;

        return true;

    // Farbe wurde schon von jemanen ausgewählt -> nichts machen
    } else {
        return false;

    }
}

/**
 * Liefert für alle Spieler in einem Raum seine ausgesuchte Farbe. 
 * @memberof players
 * @param {String} roomId Die RaumId des Raums.
 * @returns {Object[]} Ein Array von Objekten. In einem Objekt steht jeweils die socketId des Spielers
 * und seine Farbe. Wurde noch keine Farbe ausgesucht ist der Wert 'undefined'.
 */
const getColors = (roomId) => {
    let result = []
    let playersInRoom = players.filter((p) => p.roomId == roomId);

    // Geht jede Farbe durch und schaut ob diese schon im Raum vergeben ist
    for(color of colors) {
        let index = playersInRoom.findIndex((player) => player.color === color);

        // Farbe im Raum schon vergeben
        if(index != -1) {
            result.push({ color: color, socketId: playersInRoom[index].socketId });

        // Farbe im Raum noch nicht vergeben
        } else {
            result.push({ color: color, socketId: undefined});

        }
    }
    
    return result;
}

/**
 * Sotiert die Spielerpositionen neu. Wird beispielsweise bei einem disconnect in der Lobby gebraucht. Dort muss die
 * Position des Spieler neu berechnet werden.
 * @memberof players
 * @param {String} roomId Die RaumId des Raums.
 */
const reorderPlayerPositions = (roomId) => {
    let playersInRoom = getPlayersInRoom(roomId);
    
    counter = 0;

    for(player of playersInRoom) {
        let index = playersInRoom.findIndex((p) => p.socketId === player.socketId);
        players[index].position = counter;

        counter++;
    }

    playersInRoom = getPlayersInRoom(roomId);
}


module.exports = { addPlayer, removePlayer, getPlayer, getPlayersInRoom, reorderPlayerPositions, setColor, getColors, getCurrentPlayerInRoom, nextPlayerInRoom };