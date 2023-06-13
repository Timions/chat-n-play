const { getPlayer } = require("../../../models/players");
const { submitWords } = require("../../../games/slf/gameLogic");

module.exports = (io, socket, data, callback) => {

    submitWords(socket.id, data.words, (words, letter) => {
        const player = getPlayer(socket.id);

        if(player === undefined) return;

        io.in(player.roomId).emit('slf:evaluating-results', { words: words, letter: letter });
    });
}