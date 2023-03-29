import { AbstractPlayer } from "./player.js"
import Queue from 'queue-promise'
import * as tf from '@tensorflow/tfjs-node'

class AIModel {
    #model
    #queue

    constructor() {
        this.#model = this.createModel()

        this.#queue = new Queue({
            concurrent: 1,
            interval: 3000,
            start: true,
        })
    }

    createModel() {
        const model = tf.sequential()
        model.add(tf.layers.dense({ units: 9, activation: 'relu', inputShape: [9] }))

        model.compile({
            optimizer: tf.train.adam(),
            loss: 'meanSquaredError'
        })

        return model
    }

    predict(board) {
        if (!this.#model) {
            throw new Error('Model not initialized')
        }

        return this.#model
            .predict(tf.tensor(board, [1, 9]))
            .dataSync()
    }

    /**
     * @param {String} status 
     * @param {Game} game 
     */
    async trainOnGameResults(status, result) {
        this.#queue.enqueue(() => {
            try {
                this.updateWinModel(result)
            } catch(error) {
                console.log(error)
            }
        })
        this.#queue.dequeue()
    }

    updateWinModel(result) {
        const board = [...result.board.values()]

        const outcomes = board.map(value => {
            if (value === result.winner) {
                return 1
            } else if (value == null) {
                return 0
            }
            return -1
        })

        return this.#trainModel(result, board, outcomes)
    }

    async #trainModel(result, board, outcomes) {
        const xs = tf.tensor(board, [1, 9])
        const ys = tf.tensor(outcomes, [1, 9])

        await this.#model.fit(xs, ys, {
            epochs: 50,
            batchSize: 32,
            shuffle: true,
            verbose: 0
        })

        xs.dispose()
        ys.dispose()

        console.log({
            message: 'Tranning based on game result finished',
            trainingData: {
                winIndex: result.winner,
                board: board,
                outcomes: outcomes
            }
        })
    }
}

class Bot extends AbstractPlayer {
    /**
     * @returns {String}
     */
    getNickName() {
        return 'Bot #' + this.getId().substring(0, 3)
    }

    /**
     * @param {Number} position 
     */
    makeMove(position) {
        this._getGame().makeMove(this, position)
    }

    quite() {
        this._getGame().finishGame(() => 'player quite')
    }

    /**
     * @param {String} oponentName 
     * @param {Boolean} isMyTurn 
     */
    _notifyAboutStart(oponentName, isMyTurn) {
        isMyTurn && this.#suggestBestMove()
    }

    _notifyAboutGameFinish(status) {
        aiModel.trainOnGameResults(status, this._getGame().getState())
    }

    /**
     * @param {Number} position 
     */
    notifyAboutOponentMove(position) {
        this.#suggestBestMove()
    }

    #suggestBestMove() {
        if (this._getGame().isGameFinished()) {
            return
        }

        setTimeout(() => {
            this.makeMove(this.#predictMove(this._getGame().getState().board))
        }, 50)
    }

    /**
     * @param {Array} board
     * @returns {Number}
     */
    #randomMove(board) {
        const filteredEntries = []
        this._getGame().getState().board.forEach((value, key) => {
            value === null && filteredEntries.push(key)
        })
        const randomIndex = Math.floor(Math.random() * filteredEntries.length)

        return filteredEntries[randomIndex];
    }

    /**
     * @param {Array} board
     * @returns {Number}
     */
    #predictMove(board) {
        board = [...board.values()]

        const predictions = aiModel.predict(board)

        const availableMoves = board
            .map((value, index) => (value == null ? index : -1))
            .filter(value => value !== -1)

        availableMoves.sort((a, b) => {
            return predictions[b] - predictions[a]
        })

        console.log({
            message: 'Bot predicted moves',
            predictions: predictions,
            moves: availableMoves
        })

        return availableMoves[0]
    }
}

const aiModel = new AIModel()

export { Bot }