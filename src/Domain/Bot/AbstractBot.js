import {AbstractPlayer} from "../Player/AbstractPlayer.js";

/**
 * Represents an abstract bot player in the game.
 */
class AbstractBot extends AbstractPlayer {
    /** @override */
    getNickName() {
        return this._getBotName() + ' #' + this.getId().substring(0, 3);
    }

    /**
     * Retrieves the bot's base name.
     * @returns {string} The default bot name.
     */
    _getBotName() {
        return "Bot";
    }

    /** @override */
    makeMove(position) {
        this._getGame().makeMove(this, position);
    }

    /** @override */
    async notifyAboutOpponentMove(position, board) {
        if (this._game?.isGameFinished() === false) {
            this._makeBestMove(board);
        }
    }

    /** @override */
    async _notifyAboutStart(opponentName, isMyTurn, board) {
        if (isMyTurn) {
            this._makeBestMove(board);
        }
    }

    /**
     * Executes the best move based on the bot's strategy.
     * @param {Map<number, number>} board - The current board state.
     */
    _makeBestMove(board) {
        // To be implemented in subclasses
    }
}

export {AbstractBot};
