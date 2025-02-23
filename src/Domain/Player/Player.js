import {EventEmitter} from "../EventEmitter.js"
import {AbstractPlayer} from "./AbstractPlayer.js"

/**
 * Represents a player in the game, extending AbstractPlayer.
 */
class Player extends AbstractPlayer {
    /**
     * Event emitter for communication with the client.
     * @type {EventEmitter}
     */
    #emitter

    /**
     * Player's nickname.
     * @type {string}
     */
    #nickName = ""

    /**
     * @param {EventEmitter} emitter - The event emitter instance.
     */
    constructor(emitter) {
        super()
        this.#emitter = emitter
    }

    /** @override */
    setNickName(nickName) {
        this.#nickName = nickName
    }

    /** @override */
    getNickName() {
        return this.#nickName
    }

    /** @override */
    makeMove(position) {
        this._getGame().makeMove(this, position)
    }

    /** @override */
    quit() {
        this._getGame().finishGame(() => "player quit")
    }

    /** @override */
    async notifyAboutOpponentMove(position, board) {
        this.#emitter.opponentMoved({position})
    }

    /** @override */
    async _notifyAboutStart(opponentName, isMyTurn, board) {
        this.#emitter.gameStarted(opponentName, isMyTurn)
    }

    /** @override */
    async _notifyAboutGameFinish(status, gameState) {
        this.#emitter.gameFinished(status)
    }
}

export {Player}
