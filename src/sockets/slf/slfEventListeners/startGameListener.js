const { isHost, getRoom } = require('../../../models/rooms');
const { getPlayer } = require('../../../models/players');
const { initilazeGame, chooseLetter } = require('../../../games/slf/gameLogic');

module.exports = (io, socket, data, callback) => {
    
    // Nur der Host dard das Spiel starten bzw. die Kategorien auswählen
    if(!isHost(socket.id)) return callback('Nur der Host des Raums darf das Spiel starten.');

    // 3-5 Kategorien müssen ausgewählt sein
    if((data.categories).length < 3 || (data.categories).length > 6) return callback('Es dürfen nur 3-6 Kategorien ausgewählt werden!');

    // Keine Kategories doppelt verwenden
    const unique = new Set();
    
    for(cat of data.categories) {
        unique.add(cat.category.toLowerCase());
    }

    if(unique.size != data.categories.length) return callback('Du darfst keine Kategorien mehrfach auswählen!');

    // Host bekommen
    const player = getPlayer(socket.id);

    if(player === undefined) return;
    
    // Spiel initialisieren
    let initialPlayerScores = initilazeGame(player.roomId, data.categories, data.rounds);

    // Den neuen Score returnen
    io.in(player.roomId).emit('room:score-update', { scores: initialPlayerScores });

    // Allen Spielern die Kategorien + Runden übergeben
    io.in(player.roomId).emit('slf:submit-game-infos', { categories: data.categories, rounds: data.rounds });

    // Buchstabe aussuchen nach einer kurzen Pause, damit sich alle die Kategorien anschauen können
    setTimeout(() => {
        chooseLetter(player.roomId, (letter) => {
            const room = getRoom(player.roomId);

            if(room === undefined) return;

            room.currentRound += 1;
            
            io.in(player.roomId).emit('slf:start-round', { letter });
        });
    }, 2000);
}