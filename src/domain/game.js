import { Util } from "../service/util.js"
import { AbstractPlayer } from "./player.js"

class Game {
    #id
    #turnIndex = 0
    #players
    #rule

    /**
     * @param {List<AbstractPlayer>} players 
     */
    constructor(players) {
        this.#id = Util.uuid()
        this.#rule = new ClassicRule()
        this.#players = players

        this.#startGame()
    }

    /**
     * @returns {AbstractPlayer}
     */
    whoseTurn() {
        return this.#players[this.#turnIndex]
    }

    /**
     * @throws {Error}
     * 
     * @param {AbstractPlayer} player 
     * @param {Number} position 
     */
    makeMove(player, position) {
        if (this.whoseTurn() != player) {
            throw new Error('Not this player turn.')
        }

        this.#rule.mark(position, this.#turnIndex)
        this.#iterateTurn(position)

        if (this.#rule.isGameFinished()) {
            this.finishGame(this.#rule.getWinStatusCallback())
        }
    }

    isGameFinished() {
        return this.#rule.isGameFinished()
    }

    finishGame(statusCallback) {
        this.#players.forEach((player, index) => {
            player.dettachGame(statusCallback(index))
        })

        console.log({
            message: 'Game finished.',
            game: this.#id
        })
    }

    /**
     * @param {AbstractPlayer} player 
     */
    getPlayerIndex(player) {
        let result = -1

        this.#players.forEach((playerIteration, index) => {
            if (playerIteration === player) {
                result = index
            }
        })

        return result
    }

    /**
     * @returns {Object}
     */
    getState() {
        return this.#rule.getState()
    }

    /**
     * @param {Integer} position 
     */
    #iterateTurn(position) {
        this.#turnIndex = this.#turnIndex == 0 ? 1 : 0
        this.#players[this.#turnIndex].notifyAboutOponentMove(position);
    }

    #startGame() {
        this.#players.forEach((player) => {
            if (player.hasActiveGame()) {
                throw new Error('Player already in game.')
            }
        })

        const playerIds = []
        this.#players.forEach((player, index) => {
            const oponentName = this.#players[index == 0 ? 1 : 0].getNickName()
            player.attachGame(this, oponentName, this.#turnIndex == index)
            playerIds.push(player.getId())
        })

        console.log({
            message: 'Game started.',
            game: this.#id,
            players: playerIds
        })
    }
}

class ClassicRule {
    #winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    #winnerIndex = -1
    #size = 3
    #map

    constructor() {
        this.#map = new Map()

        for (let i = 0; i < Math.pow(this.#size, 2); i++) {
            this.#map.set(i, null)
        }
    }

    /**
     * @throws {Error}
     * @param {*} position 
     * @param {*} playerIndex 
     */
    mark(position, playerIndex) {
        let isValidPosition = position < Math.pow(this.#size, 2)

        if (isValidPosition && this.#map.get(position) == null) {
            this.#map.set(position, playerIndex)
        } else {
            throw new Error('This cell is already occupied.')
        }
    }

    isGameFinished() {
        if (this.#winnerIndex > -1) {
            return true
        }

        let isDraw = true
        for (let i = 0; i < this.#winPatterns.length; i++) {
            const p = this.#winPatterns[i],
                a = this.#map.get(p[0]),
                b = this.#map.get(p[1]),
                c = this.#map.get(p[2])

            if (a == null || b == null || c == null) {
                isDraw = false
                continue
            }

            if (a == b && b == c) {
                this.#winnerIndex = a
                return true
            }
        }

        return isDraw
    }

    /**
     * @returns {Function}
     */
    getWinStatusCallback() {
        return (playerIndex) => {
            if (this.#winnerIndex == -1) {
                return 'draw'
            }

            return playerIndex == this.#winnerIndex ? 'win' : 'lose'
        }
    }

    /**
     * @returns {Integer}
     */
    getWinnerIndex() {
        return this.#winnerIndex
    }

    /**
     * @returns {Object}
     */
    getState() {
        return {
            winner: this.#winnerIndex,
            board: this.#map,
        }
    }
}

export { Game, ClassicRule }