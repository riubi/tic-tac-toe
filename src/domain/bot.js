import { AbstractPlayer } from "./player.js"

class Bot extends AbstractPlayer {
    /**
     * @returns {String}
     */
    getNickName() {
        return 'Bot #' + this.getId().substring(0, 3)
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
     * @param {String} oponentName 
     * @param {Boolean} isPlayerTurn 
     */
    _notifyAboutStart(oponentName, isPlayerTurn) {
        isPlayerTurn && this.#randomMove()
    }

    /**
     * @param {Number} position 
     */
    notifyAboutOponentMove(position) {
        this.#randomMove()
    }

    #randomMove() {
        if (this._getGame().isGameFinished()) {
            return
        }

        setTimeout(() => {
            const filteredEntries = []
            this._getGame().getState().forEach((value, key) => {
                value == null && filteredEntries.push(key)
            })

            const randomIndex = Math.floor(Math.random() * filteredEntries.length)
            this.makeMove(filteredEntries[randomIndex])
        }, 500)
    }
}

export { Bot }