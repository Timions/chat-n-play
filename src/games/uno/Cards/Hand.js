class Hand {
    constructor() {
        this.hand = [];
  
    }

    // Wenn ein Spieler eine Karte zieht, diese Karte auf die Hand legen
    addCard(card) {
        this.hand.push(card);
    }

    // Wenn der Spieler einer Karte abgibt
    discard(card) {
        let index = this.hand.findIndex(c => c.id === card.id);
        this.hand.splice(index, 1);
    }

    // Die Anzahl der Karten zurückgebgen
    getHandSize() {
        return this.hand.length;
    }

    // Ob eine bestimmte Karte auf der Hand liegt
    hasCard(cardId) {
        let cardIndex = this.hand.findIndex(c => c.id === cardId);

        if(cardIndex === -1) {
            return false;

        } else {
            return true;
            
        }
    }
}

module.exports = { Hand }