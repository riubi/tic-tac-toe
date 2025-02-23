import Queue from "queue-promise"
import * as tf from "@tensorflow/tfjs-node"

/**
 * AI model for training and predicting optimal moves in Tic-Tac-Toe.
 */
class AiModel {
    /**
     * The neural network model.
     * @type {tf.Sequential}
     */
    #model

    /**
     * Reward mapping for different game outcomes.
     * @type {{lose: number, draw: number, win: number}}
     */
    #rewardMapping = {
        lose: -1,
        draw: 0.5,
        win: 1,
    }

    /**
     * Punishment factor to reduce likelihood of losing moves.
     * @type {number}
     */
    #punishmentFactor = 0.5

    /**
     * Training queue for asynchronous model training.
     * @type {Queue}
     */
    #trainQueue

    /**
     * Chance of making a random move instead of the best predicted move.
     * @type {number}
     */
    #randomMoveChance = 0.1

    constructor() {
        this.#model = this.#createModel()
        this.#trainQueue = new Queue({
            concurrent: 1,
            interval: 100,
            start: true,
        })
    }

    /**
     * Predicts the best move for the AI.
     * @param {Map<number, number|null>} board - The current board state.
     * @param {number} playerIndex - The AI player's index.
     * @returns {number|null} The best move position.
     */
    predict(board, playerIndex) {
        const input = tf.tensor([this.#encodeBoardState(board, playerIndex)])
        const predictions = this.#model.predict(input).arraySync()[0]

        const availableMoves = [...board.keys()].filter(index => board.get(index) === null)

        // With a probability of #randomMoveChance, choose a random move
        if (Math.random() < this.#randomMoveChance && availableMoves.length > 0) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)]
        }

        return availableMoves.reduce(
            (bestMove, index) => (predictions[index] > (predictions[bestMove] ?? -Infinity) ? index : bestMove),
            availableMoves[0]
        )
    }

    /**
     * Add on game results.
     * @param {string} status - The result of the game (win, lose, draw).
     * @param {GameState} gameState - The state of the game.
     */
    queueTrainingData(status, gameState) {
        this.#trainQueue.enqueue(async () => {
            try {
                await this.#trainModel(status, gameState)
            } catch (error) {
                console.error(error)
            }
        })
    }

    /**
     * Creates and compiles the neural network model.
     * @returns {tf.Sequential} The compiled model.
     */
    #createModel() {
        const model = tf.sequential()
        model.add(tf.layers.dense({units: 64, inputShape: [9], activation: "relu"}))
        model.add(tf.layers.dense({units: 64, activation: "relu"}))
        model.add(tf.layers.dense({units: 9, activation: "linear"}))

        model.compile({
            optimizer: "adam",
            loss: "meanSquaredError", // Используем MSE для регрессии наград
        })

        return model
    }

    /**
     * Internal method for training the model.
     * @param {string} status - The game result.
     * @param {GameState} gameState - The final game state.
     */
    async #trainModel(status, gameState) {
        const history = gameState.getHistory().get()
        if (history.length < 5) return

        const rewards = this.#computeLearningRates(history.length)
        const baseReward = this.#rewardMapping[status]
        const baseDecrement = status === "win" ? 1 : 2

        const states = []
        const labels = []
        for (let i = history.length - baseDecrement; i >= 0; i -= 2) {
            const state = this.#encodeBoardState(history[i].board, history[i].playerIndex)
            const action = history[i].move

            const label = Array(9)
                .fill(0)
                .map((_, idx) => (idx === action ? baseReward * rewards[i] : 0))

            if (status === "lose" && history[i + 1]) {
                label[history[i + 1].move] = rewards[i] * this.#punishmentFactor
            }

            states.push(state)
            labels.push(label)
        }

        const xs = tf.tensor2d(states.reverse(), [states.length, 9])
        const ys = tf.tensor2d(labels.reverse(), [labels.length, 9])

        await this.#model.fit(xs, ys, {
            epochs: 2,
            batchSize: 32,
            shuffle: true,
        })

        console.info("Training completed based on game results")
    }

    /**
     * Calculates rates for reinforcement learning.
     * @param {number} historyLength - The number of moves in the game.
     * @returns {number[]} The calculated rates.
     */
    #computeLearningRates(historyLength) {
        const baseStepRate = 2 * Math.pow(0.75, historyLength - 4)

        return Array.from({length: historyLength}, (_, i) =>
            baseStepRate * Math.pow(0.75, historyLength - i - 1)
        )
    }

    /**
     * Converts the board state into a binary representation for AI processing.
     * @param {Map<number, number|null>} board - The board state.
     * @param {number} ownerIndex - The AI player's index.
     * @returns {number[]} The binary representation of the board.
     */
    #encodeBoardState(board, ownerIndex) {
        return [...board.values()].map(value =>
            value === null ? 0 : value === ownerIndex ? 1 : -1
        )
    }
}

export {AiModel}
