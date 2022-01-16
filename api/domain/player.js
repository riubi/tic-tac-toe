import Util from "../util/util.js"
import Messenger from "./messenger.js"
import { GamePerspective } from "./game.js"

export default class Player {
    #id
    #messenger
    #nickName = ''
    #gamePerspective

    /**
     * @param {Messenger} messenger
     */
    constructor(messenger) {
        this.#id = Util.uuid()
        this.#messenger = messenger
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
     * @returns {Boolean}
     */
    inGame() {
        return !!this.#gamePerspective
    }

    /**
     * @param {Object} data 
     */
    makeMove(data) {
        try {
            this.inGame()
                ? this.#gamePerspective.makeMove(data)
                : this.showError('Player has no active game.')
        } catch (error) {
            this.showError(error.message)
        }
    }

    /**
     * @param {Object} turn 
     */
    notifyAboutMove(turn) {
        this.#messenger.notifyAboutMove(turn)
    }

    /**
     * @param {GamePerspective} gamePerspective 
     */
    startGame(gamePerspective) {
        this.#gamePerspective = gamePerspective
        this.#messenger.notifyAboutStart(
            gamePerspective.getOpponentNickName(),
            gamePerspective.isYourTurn()
        )
    }

    /**
     * @param {String} status 
     */
    finishGame(status) {
        this.#gamePerspective = null
        this.#messenger.notifyAboutFinish(status)
    }

    /**
     * @param {String} message
     * @param {Integer} code
     */
    showError(message, code) {
        this.#messenger.showError(message, code)
    }
}