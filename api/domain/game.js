import Player from "./player.js"
import Util from "../service/util.js"

class Game {
    #id
    #players
    #turnIndex
    #rule

    /**
     * @param {Player} firstPlayer 
     * @param {Player} secondPlayer 
     */
    constructor(firstPlayer, secondPlayer) {
        this.#players = [firstPlayer, secondPlayer]
        this.#turnIndex = Util.getRandomInt(1)
        this.#rule = new ClassicRule()
        this.#id = Util.uuid()

        this.#players.forEach((player) => {
            if (player.inGame()) {
                throw new Error('Player already in game.')
            }
        })

        firstPlayer.startGame(new GamePerspective(firstPlayer, secondPlayer, this))
        secondPlayer.startGame(new GamePerspective(secondPlayer, firstPlayer, this))

        console.log({
            message: 'Game started.',
            game: this.#id,
            players: [firstPlayer.getId(), secondPlayer.getId()]
        })
    }

    /**
     * @returns {Player}
     */
    whoseTurn() {
        return this.#players[this.#turnIndex]
    }

    /**
     * @throws {Error}
     * @param {Player} player 
     * @param {Integer} position 
     */
    makeMove(player, position) {
        if (this.whoseTurn() != player) {
            throw new Error('Not your turn.')
        }

        this.#rule.mark(position, this.#turnIndex)
        this.#iterateTurn(position)

        if (this.#rule.isGameFinished()) {
            this.#finishGame()
        }
    }

    /**
     * @param {Integer} position 
     */
    #iterateTurn(position) {
        this.#turnIndex = this.#turnIndex == 0 ? 1 : 0
        this.#players[this.#turnIndex].notifyAboutMove({ position: position })
    }

    #finishGame() {
        this.#players.forEach((player, index) => {
            player.finishGame(this.#rule.getWinStatus(index))
        })

        console.log({
            message: 'Game finished.',
            game: this.#id
        })
    }
}

class GamePerspective {
    #player
    #opponent
    #game

    /**
     * @param {Player} player 
     * @param {Player} opponent
     * @param {Game} game 
     */
    constructor(player, opponent, game) {
        this.#player = player
        this.#opponent = opponent
        this.#game = game
    }

    /**
     * @returns {String}
     */
    getOpponentNickName() {
        return this.#opponent.getNickName()
    }

    /**
     * @returns {Boolean}
     */
    isYourTurn() {
        return this.#game.whoseTurn() == this.#player
    }

    /**
     * @throws {Error}
     * @param {Object} data 
     */
    makeMove(data) {
        this.#game.makeMove(this.#player, parseInt(data.position))
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
                c = this.#map.get(p[2]);

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
     * @param {Integer} index 
     * @returns {String}
     */
    getWinStatus(index) {
        if (this.#winnerIndex == -1) {
            return 'draw'
        }

        return index == this.#winnerIndex ? 'win' : 'lose'
    }
}

export { Game, GamePerspective }