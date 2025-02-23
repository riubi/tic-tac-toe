import {AiModel} from "./AiModel.js";
import {AbstractBot} from "./AbstractBot.js";
import {RandomBot} from "./RandomBot.js";

/**
 * Represents an AI-driven bot player in the game.
 */
class AiBot extends AbstractBot {
    /**
     * AI model instance used for move predictions and training.
     * @type {AiModel}
     */
    #aiModel;

    /**
     * @param {AiModel} aiModel - The AI model instance.
     */
    constructor(aiModel) {
        super();
        this.#aiModel = aiModel
    }

    /** @override */
    _getBotName() {
        return "AiBot";
    }

    /** @override */
    _makeBestMove(board) {
        let game = this._getGame();
        if (game == null || game.isGameFinished()) {
            return;
        }

        let position = this.#aiModel.predict(board, this._turnIndex);
        this.makeMove(position);
    }

    /**
     * Trains the AI model based on game results.
     * @param {string} status - The final status of the game (win, lose, draw).
     * @param {GameState} gameState - The final state of the game.
     */
    async _notifyAboutGameFinish(status, gameState) {
        this.#aiModel.queueTrainingData(status, gameState);
    }
}

export {AiBot};
