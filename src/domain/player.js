import Util from "../service/util.js"
import EventEmitter from "./event-emitter.js"
import { GamePerspective, InactiveGamePerspective } from "./game.js"

export default class Player {
    #id
    #emitter
    #nickName = ''
    #gamePerspective

    /**
     * @param {EventEmitter} emitter
     */
    constructor(emitter) {
        this.#id = Util.uuid()
        this.#emitter = emitter
        this.#gamePerspective = new InactiveGamePerspective(this)
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
     * @returns {GamePerspective}
     */
    getGamePerspective() {
        return this.#gamePerspective
    }

    /**
     * @param {Object} turn 
     */
    notifyAboutOpponentMoved(turn) {
        this.#emitter.opponentMoved(turn)
    }

    /**
     * @param {GamePerspective} gamePerspective 
     */
    startGame(gamePerspective) {
        this.#gamePerspective = gamePerspective
        this.#emitter.gameStarted(
            gamePerspective.getOpponentNickName(),
            gamePerspective.isPlayerTurn()
        )
    }

    /**
     * @param {String} status 
     */
    finishGame(status) {
        this.#gamePerspective = new InactiveGamePerspective(this)
        this.#emitter.gameFinished(status)
    }

    /**
     * @param {String} message
     * @param {Integer} code
     */
    showError(message, code) {
        this.#emitter.error(message, code)
    }
}