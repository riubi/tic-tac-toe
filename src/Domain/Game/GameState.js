import {GameHistory} from "./GameHistory.js";

/**
 * Represents the state of the game board, managing player turns and the game result.
 */
class GameState {
    /**
     * Game board state.
     * @type {Map<number, number|null>}
     */
    #board;

    /**
     * Index of the player whose turn it is.
     * @type {number}
     */
    #turnIndex = 1;

    /**
     * Stores the winner's index (-1 if no winner yet).
     * @type {number}
     */
    #winnerIndex = -1;

    /**
     * Stores the game history.
     * @type {GameHistory}
     */
    #history;

    /**
     * Stores the game rule set.
     * @type {ClassicRule}
     */
    #rule;

    /**
     * @param {ClassicRule} rule - The rule set for the game.
     */
    constructor(rule) {
        this.#rule = rule;
        this.#board = new Map(Array.from({length: rule.getSize()}, (_, i) => [i, null]));
        this.#history = new GameHistory();
    }

    /**
     * Marks a position on the board.
     * @param {number} position - The board position.
     * @throws {Error} If the position is invalid or already occupied.
     * @returns {number} The index of the active player.
     */
    mark(position) {
        if (position >= this.#board.size || this.#board.get(position) !== null) {
            throw new Error("This cell is already occupied.");
        }

        this.#history.recordMove(this.getTurnIndex(), position, this.getBoard());
        this.#board.set(position, this.#turnIndex);

        const winnerIndex = this.#rule.checkWinner(this.#board);
        if (winnerIndex !== null) {
            this.#winnerIndex = winnerIndex;
        }

        this.#turnIndex = 1 - this.#turnIndex;

        return this.#turnIndex;
    }

    /**
     * Get the current board state.
     * @returns {Map<number, number|null>} The game board.
     */
    getBoard() {
        return this.#board;
    }

    /**
     * Get the game board history.
     * @returns {GameHistory} The game board history.
     */
    getHistory() {
        return this.#history;
    }

    /**
     * Get the index of the player whose turn it is.
     * @returns {number} The index of the active player.
     */
    getTurnIndex() {
        return this.#turnIndex;
    }

    /**
     * Check if the game is finished.
     * @returns {boolean} True if the game is finished, otherwise false.
     */
    isGameFinished() {
        return this.#winnerIndex !== -1 || ![...this.#board.values()].includes(null);
    }

    /**
     * Get the win status for a given player.
     * @param {number} playerIndex - The index of the player.
     * @returns {string} The result ('win', 'lose', or 'draw').
     */
    getWinStatus(playerIndex) {
        return this.#winnerIndex === -1
            ? "draw"
            : (playerIndex === this.#winnerIndex ? "win" : "lose");
    }
}

export {GameState};
