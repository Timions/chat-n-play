const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { setNextPlayer, dealCard } = require("../../../games/uno/gameLogic");

module.exports = (io, socket, data) => {

    // aktuellen Spieler bekommen
    const player = getPlayer(socket.id);
    
    // Spieler exestiert noch nicht
    if(player === undefined) return;

    // aktuellen Raum bekommen
    const room = getRoom(player.roomId);

    // Raum exestiert nicht
    if(room === undefined) return;

    // Falsches Spiel
    if(room.gameTypeId !== 1) return;

    // Noch nicht gestartet
    if(room.hasStarted === false) return;

    // Spieler nicht an der Reihe
    if(room.activePlayer.socketId !== socket.id) return;

    if(data.value < 1 || data.value > 3) return; 

    // Erster Player Input
    if(room.moveType === 7) {
        room.klopfValues[0] = { socketId: socket.id, value: data.value };
        room.moveType = 8;

        // nächster Spieler
        setNextPlayer(io, room.roomId);

        // kurze Pause
        setTimeout(() => {
            io.to(room.activePlayer.socketId).emit('uno:get-klopf');
        }, 500);

    // Zweiter Player Input
    } else if(room.moveType === 8) {
        room.klopfValues[1] = { socketId: socket.id, value: data.value };

        io.in(room.roomId).emit('uno:show-klopf-result', { result: room.klopfValues });

        // Kurze Pause damit die Spieler sich die Ergebnisse anschauen können
        setTimeout(() => {

            let cardCounter = 0;

            const dealCards = (p) => {
                dealCard(io, room, p, false);

                setTimeout(() => {

                    // Alle Karten verteilt
                    if(++cardCounter === room.klopfValues[0].value) {

                        // Move Type resetten
                        room.moveType = 4;

                        // Nächster Spieler ist dran
                        setNextPlayer(io, room.roomId);

                        // Werte resetten
                        room.klopfValues = [0, 0];

                    } else {
                        dealCards(p);

                    }
                }, 400);
            }

            // gleich oft geklopft => Spieler 2 gewinnt
            if(room.klopfValues[0].value === room.klopfValues[1].value) {
                let losingPlayer = getPlayer(room.klopfValues[0].socketId);

                if(losingPlayer !== undefined) {
                    dealCards(losingPlayer);
                }

            // Spieler der die Karte ausgespielt hat gewinnt
            } else {
                dealCards(player);

            }

        }, 2000);
    }
}