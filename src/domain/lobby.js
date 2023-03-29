import { AbstractPlayer } from "./player.js"
import { Game } from "./game.js"
import { Bot } from "./bot.js"

class Lobby {
    #players
    #searchQueue

    constructor() {
        this.#players = new Set()
        this.#searchQueue = new Set()
    }

    /**
     * @param {AbstractPlayer} player 
     */
    connect(player) {
        this.#players.add(player)
    }

    /**
     * @param {AbstractPlayer} player 
     */
    disconnect(player) {
        player.hasActiveGame() && player.quite()
        this.#players.delete(player)
        this.#searchQueue.delete(player)
    }

    /**
     * @param {AbstractPlayer} player 
     */
    searchAndStartGame(player) {
        if (player.hasActiveGame()) {
            throw new Error('Player already has active game.')
        }

        this.#searchQueue.add(player)
        this.#startGame()
    }

    registerBot() {
        setInterval(() => {
            this.searchAndStartGame(new Bot())
            // if (this.#searchQueue.size == 1) {
            //     this.searchAndStartGame(new Bot())
            // }
        }, 15000)
    }

    #startGame() {
        if (this.#searchQueue.size < 2) {
            return
        }

        const iterator = this.#searchQueue.values()
        let players = [iterator.next().value, iterator.next().value]
        players.forEach((player) => this.#searchQueue.delete(player))

        new Game(players.sort(() => Math.random() - 0.5))
    }
}

export { Lobby }