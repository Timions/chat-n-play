const dices = [];

roll = (roomId) => {
    const diceIndex = dices.findIndex(dice => dice.roomId === roomId);
    if(diceIndex != -1) {
        const dice = dices[diceIndex];
        dice.value = Math.floor(Math.random() * 6) + 1;
    }
}

getDiceValue = (roomId) => {
    const diceIndex = dices.findIndex(dice => dice.roomId === roomId);
    if(diceIndex != -1) {
        return dices[diceIndex].value;
    }
    return false;
}

const addDice = (roomId) => {
    const diceExisting = dices.find(dice => dice.roomId === roomId);
    const dice = {roomId, value:undefined};
    if(!diceExisting){
        dices.push(dice);
    }
}

const removeDice = (roomId) => {
    const diceIndex = dices.findIndex(dice => dice.roomId === roomId);
    if(diceIndex != -1) {
        const dice = dice[diceIndex];
        dices.splice(diceIndex, 1)

        return dice;
    }
    return false;
}

module.exports = {roll, getDiceValue, addDice, removeDice};