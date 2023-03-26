import { AbstractPlayer } from "./player.js"
import * as tf from '@tensorflow/tfjs'

class AIModel {
    constructor() {
        this.model = this.createModel()
    }

    createModel() {
        const model = tf.sequential()
        model.add(tf.layers.dense({ inputShape: [9], units: 64, activation: 'relu' }))
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }))
        model.add(tf.layers.dense({ units: 9, activation: 'linear' }))

        model.compile({ optimizer: 'adam', loss: 'meanSquaredError' })
        return model
    }

    predict(board) {
        if (!this.model) {
            throw new Error('Model not initialized')
        }

        const input = tf.tensor2d([board])
        const output = this.model.predict(input)

        const prediction = output.array()
        return prediction[0]
    }

    train(states, nextStates, rewards, actions, done) {
        const batchSize = states.length
        const target = this.model.predict(tf.tensor2d(states))

        const nextStateValues = this.model.predict(tf.tensor2d(nextStates))
        const maxNextStateValues = tf.max(nextStateValues, 1)

        const targetQs = rewards.map((reward, i) => {
            if (done[i]) {
                return reward
            } else {
                return reward + 0.99 * maxNextStateValues[i]
            }
        })

        for (let i = 0; i < batchSize; i++) {
            target[i][actions[i]] = targetQs[i]
        }

        this.model.fit(tf.tensor2d(states), tf.tensor2d(target), { batchSize })
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
     * @param {Boolean} isPlayerTurn 
     */
    _notifyAboutStart(oponentName, isPlayerTurn) {
        isPlayerTurn && this.#decideMove()
    }

    /**
     * @param {Number} position 
     */
    notifyAboutOponentMove(position) {
        this.#decideMove()
    }

    #decideMove() {
        if (this._getGame().isGameFinished()) {
            return
        }

        setTimeout(() => {
            this.makeMove(this.#predictMove(this._getGame().getState()))
        }, 500)
    }

    /**
     * @param Map board
     * @returns Number
     */
    #randomMove(board) {
        const filteredEntries = []
        this._getGame().getState().forEach((value, key) => {
            value === null && filteredEntries.push(key)
        })
        const randomIndex = Math.floor(Math.random() * filteredEntries.length)

        return filteredEntries[randomIndex];
    }

    /**
     * @param Map board
     * @returns Number
     */
    #predictMove(board) {
        const convertedBoard = board.map((cell) => (cell === null ? -1 : cell));
        const predictions = aiModel.predict(convertedBoard);

        const availableMoves = board
            .map((cell, index) => (cell === null ? index : -1))
            .filter((index) => index !== -1)

        const bestMoveIndex = availableMoves.reduce(
            (maxIndex, move, _, array) => {
                predictions[move] > predictions[array[maxIndex]] ? move : array[maxIndex]
            },
            availableMoves[0]
        );

        return bestMoveIndex;
    }
}

const aiModel = new AIModel()

export { Bot }