import Player from "./player.js"
import Game from "./game.js"

/**
 * @param {Set<Player>} #players
 */
class Lobby {
    #players
    #searchQueue

    constructor() {
        this.#players = new Set()
        this.#searchQueue = []
    }

    /**
     * @param {Player} player 
     */
    connect(player) {
        this.#players.add(player)
    }

    /**
     * @param {Player} player 
     */
    disconnect(player) {
        this.#players.delete(player)
    }

    /**
     * @param {Player} player 
     */
    searchAndStartGame(player) {
        if (player.getGamePerspective().isActive()) {
            player.showError('Player already in active game.')
        } else {
            const opponent = this.#searchQueue.pop()

            opponent && opponent != player
                ? new Game(player, opponent)
                : this.#searchQueue.push(player)
        }
    }
}

export { Lobby }