import {Util} from "../../Service/Util.js";

/**
 * Abstract class representing a player in the game.
 */
class AbstractPlayer {
    /**
     * Unique identifier for the player.
     * @type {string}
     */
    #id = Util.uuid();

    /**
     * Reference to the current game the player is in.
     * @type {Game|null}
     */
    _game = null;

    /**
     * Reference to the current turn index in game.
     * @returns {number|null}
     */
    _turnIndex = null;

    /**
     * Get the player's unique ID.
     * @returns {string}
     */
    getId() {
        return this.#id;
    }

    /**
     * Set the player's nickname.
     * @param {string} nickName
     */
    setNickName(nickName) {
        // To be implemented in subclasses
    }

    /**
     * Get the player's nickname.
     * @returns {string}
     */
    getNickName() {
        // To be implemented in subclasses
    }

    /**
     * Make a move in the game.
     * @param {number} position - The position on the board to place the move.
     */
    makeMove(position) {
        // To be implemented in subclasses
    }

    /**
     * Quit the game.
     */
    quit() {
        // To be implemented in subclasses
    }

    /**
     * Notify the player about an opponent's move.
     * @param {number} position - The position where the opponent moved.
     * @param {Map<number, number>} board - The current board state.
     */
    async notifyAboutOpponentMove(position, board) {
        // To be implemented in subclasses
    }

    /**
     * Start the game and notify the player.
     * @param {Game} game - The game instance.
     * @param {string} opponentName - The opponent's name.
     * @param {boolean} isMyTurn - Whether it is the player's turn.
     * @param {Map<number, number>} board - The current board state.
     */
    startGame(game, opponentName, isMyTurn, board) {
        if (this.hasActiveGame()) {
            throw new Error("Player already in game.");
        }
        this._game = game;
        this._turnIndex = isMyTurn ? 1 : 0;
        this._notifyAboutStart(opponentName, isMyTurn, board);
    }

    /**
     * Detach the player from the current game.
     * @param {string} status - The final status of the game.
     * @param {GameState} gameState - The current game state.
     */
    detachGame(status, gameState) {
        this._notifyAboutGameFinish(status, gameState);
        this._game = null;
        this._turnIndex = null;
    }

    /**
     * Check if the player has an active game.
     * @returns {boolean} True if the player is in a game, false otherwise.
     */
    hasActiveGame() {
        return !!this._game;
    }

    /**
     * Get the current game instance.
     * @returns {Game} The game instance.
     * @throws {Error} If the player has no active game.
     */
    _getGame() {
        if (!this._game) {
            throw new Error(`Player ${this.getId()} has no active game.`);
        }
        return this._game;
    }

    /**
     * Notify the player about the game start.
     * @param {string} opponentName - The opponent's name.
     * @param {boolean} isMyTurn - Whether it is the player's turn.
     * @param {Map<number, number>} board - The current board state.
     */
    async _notifyAboutStart(opponentName, isMyTurn, board) {
        // To be implemented in subclasses
    }

    /**
     * Notify the player about the game finish.
     * @param {string} status - The final status of the game.
     * @param {GameState} gameState - The final state of the game.
     */
    async _notifyAboutGameFinish(status, gameState) {
        // To be implemented in subclasses
    }
}

export {AbstractPlayer};
