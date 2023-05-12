import { Server } from "socket.io";
import { Game } from "./class/game.js";
import pb from "pocketbase";
import { Player } from "./class/player.js";
const io = new Server(3000, {
    cors: { origin: "*" },
    transports: ["websocket", "polling"],
});

let currentGame: Game = new Game();

io.on("connection", (socket) => {
    if (currentGame) currentGame = new Game();
    let currentPlayer: Player;

    console.log("A user connected.");

    socket.on("join", ({ name, uuid }) => {
        if (uuid === currentPlayer?.uuid) {
            socket.emit("info", "Vous avez été reconnecté à la partie");
            return;
        }
        const { result, player, players } = currentGame.addPlayer({
            name,
            uuid: uuid,
        });
        currentPlayer = player;

        socket.emit("joined", { player, players });
        socket.broadcast.emit("playerJoined", { players });
        console.log(`[${uuid}] player joined : ${name}`);
        if (currentGame.players.length >= 2) {
            currentGame.initGame();
        }
    });

    socket.on("startGame", () => {
        if (currentGame.players.length >= 2) {
            currentGame.initGame();
            io.emit("gameStarted");
            console.log("Game started.");
        } else {
            socket.emit("error", "Not enough players.");
            console.error(
                `Game failed to start : Not enough players : ${currentGame.players.length} players.`
            );
        }
    });

    socket.on("playCard", (card) => {
        const { result, turn, deck, activeCard } = currentGame.playCard(
            currentPlayer,
            card
        );
        if (result) {
            socket.emit("playedCard", { turn, deck, activeCard });
            socket.broadcast.emit("enemyPlayedCard", { turn, activeCard });
            console.log(
                `Player ${currentPlayer.name} played a card : ${card.color} ${card.number} .`
            );
        } else {
            socket.emit("error", "You can't play this card.");
            console.error(
                `Player ${currentPlayer.name} tried to play a card : ${card.color} ${card.number} .`
            );
        }
    });

    socket.on("drawCard", (player, amount) => {
        player.drawCard(amount);
        socket.emit("drewCard", player.deck);
        socket.broadcast.emit("enemyDrewCard", player.deck.length);
        console.log(`Player ${player.name} drew ${amount} cards.`);
        console.table(player.deck);
    });

    socket.on("getGameInfo", () => {
        const { activeCard, turn, deck, enemyDeck } =
            currentGame.getGameInfo(currentPlayer);
        console.log(`Game infos asked by ${currentPlayer.name}`);
        socket.emit("gameInfo", {
            activeCard,
            turn,
            deck,
            enemyDeck,
            isFull: currentGame.isFull(),
        });

        socket.on("disconnect", (data) => {
            currentGame.players = currentGame.players.filter(
                (p) => p.uuid !== currentPlayer.uuid
            );
        });
    });

    // socket.on("drawCard", () => {
    //     const player = currentGame.players.find((p) => p.uuid === socket.id);
    //     player.drawCard();
    //     socket.emit("drewCard", player.deck);
    //     socket.broadcast.emit("enemyDrewCard", player.deck.length);
    // });

    // socket.on("getGameInfo", () => {
    //     const player = currentGame.players.find((p) => p.uuid === socket.id);
    //     socket.emit("gameInfo", currentGame.getGameInfo(player));
    // });

    // socket.on("disconnect", () => {
    //     const player = currentGame.players.find((p) => p.uuid === socket.id);
    //     const { result, players } = currentGame.removePlayer(player);
    //     if (result) {
    //         socket.emit("playerLeft", { result, players });
    //         socket.broadcast.emit("enemyLeft", { result, players });
    //     }
    // });
});
