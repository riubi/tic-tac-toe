import {AbstractPlayer} from "../Player/AbstractPlayer.js"
import {Game} from "../Game/Game.js"
import {RandomBot} from "../Bot/RandomBot.js"
import {AiModel} from "../Bot/AiModel.js"
import {AiBot} from "../Bot/AiBot.js"

/**
 * Manages the game lobby, including player connections, game searches, and bot registrations.
 */
class Lobby {
    /**
     * Set of connected players.
     * @type {Set<AbstractPlayer>}
     */
    #players = new Set()

    /**
     * Queue of players searching for a game.
     * @type {AbstractPlayer[]}
     */
    #searchQueue = []

    /**
     * Connect a player to the lobby.
     * @param {AbstractPlayer} player - The player to connect.
     */
    connect(player) {
        this.#players.add(player)
    }

    /**
     * Disconnect a player from the lobby.
     * @param {AbstractPlayer} player - The player to disconnect.
     */
    disconnect(player) {
        if (player.hasActiveGame()) {
            player.quit()
        }
        this.#players.delete(player)
        this.#searchQueue = this.#searchQueue.filter(p => p !== player)
    }

    /**
     * Add a player to the game search queue.
     * @param {AbstractPlayer} player - The player searching for a game.
     * @throws {Error} If the player already has an active game.
     */
    searchAndStartGame(player) {
        if (player.hasActiveGame()) {
            throw new Error("Player already has active game.")
        }
        this.#searchQueue.push(player)
    }

    /**
     * Start a new game if enough players are in the queue.
     */
    startGameIfPossible() {
        while (this.#searchQueue.length >= 2) {
            const players = [this.#searchQueue.shift(), this.#searchQueue.shift()]
                .sort(() => Math.random() - 0.5)

            new Game(players)
        }
    }

    /**
     * Start the lobby processes for bot registration and game matching.
     */
    start() {
        this.#initBots()

        setInterval(() => {
            this.startGameIfPossible()
        }, 1000)
    }

    /**
     * Registers bots into the search queue.
     */
    #initBots() {
        const aiModel = new AiModel()

        // Base Training Data Set
        setImmediate(async () => {
            let gameIteration = 0
            while (gameIteration++ <= 250) {
                const players = [new AiBot(aiModel), new RandomBot()]
                    .sort(() => Math.random() - 0.5)
                new Game(players)
            }
        })

        setInterval(() => {
            this.searchAndStartGame(new AiBot(aiModel))
        }, 10000)
    }
}

export {Lobby}
