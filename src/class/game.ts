import { Card } from "./card.js";
import { Player } from "./player.js";

interface gameConstructor {
    players: Player[];
}

export class Game {
    players: Player[] = [];
    // isFull: boolean = false;
    activeCard: Card;
    turn: number = 0;

    initGame() {
        this.activeCard = new Card();
        return { result: true, activeCard: this.activeCard };
    }

    addPlayer({ name, uuid }): {
        result: boolean;
        player: Player;
        players: Player[];
    } {
        let newPlayer = new Player({ name, uuid });
        let r = false;
        if (this.players.length <= 2) {
            this.players.push(newPlayer);
        } else {
            r = false;
        }
        return { result: r, player: newPlayer, players: this.players };
    }

    playCard(
        player: Player,
        playedCard: Card
    ): { result: boolean; turn: number; deck: Card[]; activeCard: Card } {
        const { color, value, type } = playedCard;
        let r = false;
        if (
            color === this.activeCard.color ||
            value === this.activeCard.value ||
            type === this.activeCard.type ||
            color === "wild"
        ) {
            player.playCard(playedCard);
            this.activeCard = playedCard;

            let old = player.deck;
            player.deck = old.filter((card) => card !== playedCard);

            this.turn++;
            r = true;
        } else {
            r = false;
        }
        return {
            result: r,
            turn: this.turn,
            deck: player.deck,
            activeCard: this.activeCard,
        };
    }

    getGameInfo(who: Player): {
        activeCard: Card;
        turn: number;
        deck: Card[];
        enemyDeck: number;
    } {
        return {
            activeCard: this.activeCard,
            turn: this.turn,
            deck: who?.deck,
            enemyDeck: this.players
                .filter((player) => player !== who)
                .map((player) => player.deck.length)[0],
        };
    }

    triggerUno(player: Player): { result: boolean } {
        player.triggerUno();
        return { result: player.Uno };
    }

    triggerCounterUno(origin: Player, target: Player): { result: boolean } {
        let r = false;
        if (!target.Uno) {
            target.Uno = false;
            this.drawCard(target, 2);
            r = true;
        } else {
            this.drawCard(origin, 2);
        }
        return { result: r };
    }

    drawCard(
        player: Player,
        amount: number
    ): {
        result: boolean;
        turn: number;
        deck: Card[];
    } {
        let r = player.drawCard(amount);
        this.turn++;
        return { result: r, turn: this.turn, deck: player.deck };
    }

    isFull(): boolean {
        return this.players.length > 1;
    }
}
