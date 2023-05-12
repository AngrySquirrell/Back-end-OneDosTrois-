import { Card } from "./card.js";

interface playerConstructor {
    name?: string;
    uuid: string;
}

export class Player {
    name: string;
    deck: Card[];
    Uno: boolean;
    uuid: string;

    constructor({ name = "Anonymous", uuid }: playerConstructor) {
        this.name = name;
        this.deck = [];
        this.Uno = false;
        this.uuid = uuid;
        for (let i = 0; i < 7; i++) {
            this.deck.push(new Card());
        }
    }

    triggerUno() {
        if (this.deck.length === 1) this.Uno = true;
    }

    drawCard(amount: number = 1) {
        for (let i = 0; i < amount; i++) this.deck.push(new Card());
        return true;
    }

    playCard(card: Card) {
        this.deck.filter((c) => c !== card);
    }

    shuffleDeck() {
        for (let i = 0; i < 7; i++) {
            this.deck.push(new Card());
        }
    }
}
