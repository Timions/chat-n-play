const { getPlayer } = require("../../../models/players");
const { getRoom } = require("../../../models/rooms");
const { setNextPlayer, dealCard } = require("../../../games/uno/gameLogic");

module.exports = (io, socket) => {
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

    // Spiel noch nicht angefangen
    if(room.cardOnBoard === 0) return;

    // Nur einemal eine Karte ziehen
    if(player.didDrawCard === true) return;

    if(player.active === false) return;

    player.didDrawCard = true;

    // normalTurn = true, wenn man normal eine Karte vom Kartenstapel zieht => um 'Zug beenden' Btn anzuzeigne
    const drawCard = (numCards, normalTurn) => {

        // Karte ziehen
        dealCard(io, room, player, normalTurn);

        // noch eine Karte ziehen
        if(--numCards !== 0) {
            setTimeout(() => {
                drawCard(numCards);

            }, 500);

        // Alle Karten gezogen
        } else {
            if(!normalTurn) {
                setTimeout(() => {
                    setNextPlayer(io, room.roomId, () => {
                        // Card Count reseten
                        room.cardsCount = 0;

                        // Karten wurden gezogen => nächster muss keine Karten mehr ziehen
                        room.moveType = 1;
                    });
                }, 500);
            }

        }
    }

    // Normaler Zug => Eine Karte nehmen || Nach Klopf Karte
    if(room.moveType === 1 || room.moveType === 4) {
        drawCard(1, true);

    // Karten ziehen wegen +2 oder +4 Karten
    } else if(room.moveType === 2 || room.moveType === 3) {
        drawCard(room.cardsCount, false);
    }
}