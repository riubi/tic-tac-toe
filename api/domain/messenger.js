import { Sender } from "ws"

export default class Messenger {
    #connection

    /**
     * @param {Sender} connection 
     */
    constructor(connection) {
        this.#connection = connection
    }

    /**
     * @param {String} type 
     * @param {Object} data 
     */
    send(type, data) {
        data.type = type
        this.#connection.send(JSON.stringify(data))
    }

    /**
     * @param {String} oponent 
     * @param {Boolean} isYourTurn 
     */
    notifyAboutStart(oponent, isYourTurn) {
        this.send('gameStarted', {
            opponent: oponent,
            isYourTurn: isYourTurn
        })
    }

    /**
     * @param {Object} turn
     */
    notifyAboutMove(turn) {
        this.send('opponentMoved', {
            position: turn.position
        })
    }

    /**
     * @param {String} status 
     */
    notifyAboutFinish(status) {
        this.send('gameFinished', {
            status: status
        })
    }

    /**
     * @param {String} message 
     * @param {Integer} code
     */
    showError(message, code) {
        this.send('error', {
            message: message,
            code: code
        })
    }
}