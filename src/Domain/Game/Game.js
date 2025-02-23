import {GameState} from "./GameState.js";
import {ClassicRule} from "./ClassicRule.js";
import {Util} from "../../Service/Util.js";

/**
 * Manages a Tic-Tac-Toe game session.
 */
class Game {
    /**
     * Unique identifier for the game.
     * @type {string}
     */
    #id = Util.uuid();

    /**
     * The game state instance.
     * @type {GameState}
     */
    #gameState;

    /**
     * List of players participating in the game.
     * @type {AbstractPlayer[]}
     */
    #players;

    /**
     * @param {AbstractPlayer[]} players - The players participating in the game.
     */
    constructor(players) {
        this.#gameState = new GameState(new ClassicRule());
        this.#players = players;
        this.#startGame();
    }

    /**
     * Handles a player's move.
     * @param {AbstractPlayer} player - The player making the move.
     * @param {number} position - The position of the move.
     * @throws {Error} If it's not the player's turn.
     */
    makeMove(player, position) {
        console.log({
            message: 'Game move.',
            player: player.getNickName(),
            statuses: position,
            turnIndex: this.#gameState.getTurnIndex(),
            game: this.#id,
        });

        if (this.#players[this.#gameState.getTurnIndex()] !== player) {
            throw new Error("Not this player's turn.");
        }

        const turnIndex = this.#gameState.mark(position);

        setImmediate(() => {
            this.#players[turnIndex].notifyAboutOpponentMove(position, this.#gameState.getBoard());
        });

        if (this.isGameFinished()) {
            this.finishGame();
        }
    }

    /**
     * Finishes the game and updates statistics.
     */
    finishGame() {
        let statuses = []
        this.#players.forEach((player, index) => {
            const status = this.#gameState.getWinStatus(index);
            player.detachGame(status, this.#gameState);
            statuses.push(player.getNickName() + ': ' + status);
        });

        this.#gameState.getHistory().logHistory();

        console.log({
            message: 'Game finished.',
            statuses: statuses,
            game: this.#id,
        });
    }

    /**
     * Checks if the game is finished.
     * @returns {boolean} True if the game is finished, otherwise false.
     */
    isGameFinished() {
        return this.#gameState.isGameFinished();
    }

    /**
     * Start the game and notify players.
     */
    #startGame() {
        console.log({
            message: "Game started.",
            game: this.#id,
            players: this.#players.map(p => p.getNickName()),
        });

        this.#players.forEach((player, index) => {
            const opponentName = this.#players[1 - index].getNickName();
            const isPlayerTurn = this.#gameState.getTurnIndex() === index;
            player.startGame(this, opponentName, isPlayerTurn, this.#gameState.getBoard());
        });
    }
}

export {Game};
