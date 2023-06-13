const { Card } = require('./Card');

class Deck {
    constructor() {
        this.deck = [];

        this.create();
    }

    // Erstellt das Deck
    create() {
        for(let deckCounter = 0; deckCounter < 2; deckCounter++) {
            for(let color = 0; color < 5; color++ ) {
    
                // Spezial Karte
                if(color === 4) {
                    for(let value = 0; value < 3; value++ ) {
                        this.deck.push( new Card(value, color) );
                    }
                
                // Keine Spezial Karte
                } else {
                    // Die Karte mit dem Wert 0 darf pro Farbe nur einmal vorkommen
                    if(deckCounter !== 1) {
                        for(let value = 0; value < 13; value++ ) {
                            this.deck.push( new Card(value, color) );
                        }
                    } else {
                        for(let value = 1; value < 13; value++ ) {
                            this.deck.push( new Card(value, color) );
                        }
                    }
                }
            }
        }
    }

    // Mischt das Kartendeck
    shuffle() {
        const { deck } = this;
        let m = deck.length, i;
      
        while (m) {
          i = Math.floor(Math.random() * m--);
      
          [deck[m], deck[i]] = [deck[i], deck[m]];
        }
      
        return this;
    }

    // Wenn ein Spieler eine Karte zieht
    takeCard() {

        // Wenn das Deck leer ist => neu mischen
        if(this.deck.length === 0) {
            this.create();
            this.shuffle();
        }

        // Letzte Karte nehmen
        const card = this.deck[this.deck.length -1]

        // Letzte Karte löschen
        this.deck.pop();

        // Ausgewählte Karte returnen
        return card;
    }
}

module.exports = { Deck }