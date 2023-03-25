import { Util } from "../service/util.js"
import { EventEmitter } from "./event-emitter.js"
import { Game } from "./game.js"

class Player {
    #id
    #emitter
    #nickName = ''
    #game

    /**
     * @param {EventEmitter} emitter
     */
    constructor(emitter) {
        this.#id = Util.uuid()
        this.#emitter = emitter
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
        this.#getGame().makeMove(this, position)
    }

    quite() {
        this.#getGame().finishGame(() => 'player quite')
    }

    /**
     * @returns {EventEmitter}
     */
    getEmitter() {
        return this.#emitter
    }

    /**
     * @param {Game} game 
     */
    attachGame(game) {
        this.#game = game
    }

    dettachGame() {
        this.#game = null
    }

    /**
     * @returns {Boolean}
     */
    hasActiveGame() {
        return !!this.#game
    }

    /**
     * @returns {Game}
     */
    #getGame() {
        if (!this.hasActiveGame()) {
            throw new Error('Player has no active game.')
        }

        return this.#game
    }
}

export { Player }