class EventEmitter {
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
    emit(type, data) {
        data.type = type
        this.#connection.send(JSON.stringify(data))
    }

    /**
     * @param {String} opponentName
     * @param {Boolean} isMyTurn
     */
    gameStarted(opponentName, isMyTurn) {
        this.emit('gameStarted', {
            opponent: opponentName,
            isYourTurn: isMyTurn
        })
    }

    /**
     * @param {Object} turn
     */
    opponentMoved(turn) {
        this.emit('opponentMoved', {
            position: turn.position
        })
    }

    /**
     * @param {String} status
     */
    gameFinished(status) {
        this.emit('gameFinished', {
            status: status
        })
    }

    /**
     * @param {String} message
     * @param {Integer} code
     */
    error(message, code) {
        this.emit('error', {
            message: message,
            code: code
        })
    }
}

export {EventEmitter}
