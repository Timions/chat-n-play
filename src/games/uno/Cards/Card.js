const { v4: uuidv4 } = require('uuid');

class Card {
    constructor(value, color) {
        this.id = uuidv4();
        this.value = value;
        this.color = color;
        this.path = (color * 13 + value) + '.png';  
    }

    isSpecial(card) {
        if(this.color === 4) {
            return true;
        }

        if(this.value > 9) {
            return true;
        }

        return false;
    }
}

module.exports = { Card }