import { Util } from "../service/util.js"
import { EventEmitter } from "./event-emitter.js"
import { Game } from "./game.js"

class AbstractPlayer {
    #id
    _game

    constructor() {
        this.#id = Util.uuid()
    }

    /**
     * @returns {String}
     */
    getId() {
        return this.#id
    }

    /**
     * @param {String} nickName 
     */
    setNickName(nickName) { }

    /**
     * @returns {String}
     */
    getNickName() { }

    /**
     * @param {Number} position 
     */
    makeMove(position) { }

    quite() { }

    /**
     * @param {String} oponentName 
     * @param {Boolean} isMyTurn 
     */
    _notifyAboutStart(oponentName, isMyTurn) { }

    /**
     * @param {String} status 
     */
    _notifyAboutGameFinish(status) { }

    /**
     * @param {Number} position 
     */
    notifyAboutOponentMove(position) { }

    /**
     * @param {Game} game 
     */
    attachGame(game, oponentName, isMyTurn) {
        this._game = game
        this._notifyAboutStart(oponentName, isMyTurn)
    }

    dettachGame(status) {
        this._notifyAboutGameFinish(status)
        this._game = null
    }

    /**
     * @returns {Boolean}
     */
    hasActiveGame() {
        return !!this._game
    }

    /**
     * @returns {Game}
     */
    _getGame() {
        if (!this.hasActiveGame()) {
            throw new Error('Player has no active game.')
        }

        return this._game
    }
}

class Player extends AbstractPlayer {
    #emitter
    #nickName = ''

    /**
     * @param {EventEmitter} emitter
     */
    constructor(emitter) {
        super()
        this.#emitter = emitter
    }

    /**
     * @param {String} nickName 
     */
    setNickName(nickName) {
        this.#nickName = nickName
    }

    /**
     * @returns {String}
     */
    getNickName() {
        return this.#nickName
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
     * @param {Number} position 
     */
    notifyAboutOponentMove(position) {
        this.#getEmitter().opponentMoved({ 
            position: position 
        })
    }

    /**
     * @param {String} oponentName 
     * @param {Boolean} isMyTurn 
     */
    _notifyAboutStart(oponentName, isMyTurn) { 
        this.#getEmitter().gameStarted(oponentName, isMyTurn)
    }

    /**
     * @param {String} oponentName 
     * @param {Boolean} isPlayerTurn 
     */
    _notifyAboutGameFinish(status) { 
        this.#getEmitter().gameFinished(status)
    }

    /**
     * @returns {EventEmitter}
     */
    #getEmitter() {
        return this.#emitter
    }
}

export { AbstractPlayer, Player }