import ClassicRule from "./game-rule.js"
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
            if (player.getGamePerspective().isActive()) {
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
            throw new Error('Not this player turn.')
        }

        this.#rule.mark(position, this.#turnIndex)
        this.#iterateTurn(position)

        if (this.#rule.isGameFinished()) {
            this.finishGame(this.#rule.getWinStatusCallback())
        }
    }

    finishGame(statusCallback) {
        this.#players.forEach((player, index) => {
            player.finishGame(statusCallback(index))
        })

        console.log({
            message: 'Game finished.',
            game: this.#id
        })
    }

    /**
     * @param {Integer} position 
     */
    #iterateTurn(position) {
        this.#turnIndex = this.#turnIndex == 0 ? 1 : 0
        this.#players[this.#turnIndex].notifyAboutOpponentMoved({ position: position })
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
     * @returns {Boolean}
     */
    isActive() {
        return true
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
    isPlayerTurn() {
        return this.#game.whoseTurn() == this.#player
    }

    /**
     * @throws {Error}
     * @param {Object} data 
     */
    makeMove(data) {
        this.#game.makeMove(this.#player, parseInt(data.position))
    }

    playerQuite() {
        this.#game.finishGame(() => 'player quite')
    }
}


class InactiveGamePerspective extends GamePerspective {
    #player

    /**
     * @param {Player} player 
     */
    constructor(player) {
        this.#player = player
    }

    /**
     * @returns {Boolean}
     */
    isActive() {
        return false
    }

    /**
     * @returns {String}
     */
    getOpponentNickName() {
        throw new Error('Player has no active game.')
    }

    /**
     * @returns {Boolean}
     */
    isPlayerTurn() {
        throw new Error('Player has no active game.')
    }

    /**
     * @param {Object} data 
     */
    makeMove(data) {
        this.#player.error('Player has no active game.')
    }

    playerQuite() {
        this.#player.error('Player has no active game.')
    }
}

export { Game, GamePerspective, InactiveGamePerspective }