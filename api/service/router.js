import Player from "../domain/player.js"
import Messenger from "../domain/messenger.js"
import { WebSocketServer } from "ws"

/**
 * @callback Callback
 * @param {Player} player
 * @param {Object} data
 */

export default class Router {
    #debug
    #routes

    /**
     * @param {Boolean} debug 
     */
    constructor(debug) {
        this.#debug = debug || false
        this.#routes = new Map()
    }

    /**
     * @param {String} event 
     * @param {Callback} callback 
     * @returns {this}
     */
    on(event, callback) {
        this.#routes.set(event, callback)
        return this
    }

    /**
     * @param {WebSocketServer} socketServer 
     */
    route(socketServer) {
        const closeMethod = this.#routes.get('close'),
            connectMethod = this.#routes.get('connect')

        socketServer.on('connection', (ws) => {
            const messenger = new Messenger(ws),
                player = new Player(messenger)

            if (connectMethod) {
                console.log({ player: player.getId(), message: 'connected' })
                connectMethod(player)
            }

            ws.on('message', (event) => {
                let data = JSON.parse(event),
                    handler = this.#routes.get(data.type)

                if (this.#debug) {
                    console.log({ player: player.getId(), data: data })
                    messenger.send('debug', {
                        data: data
                    })
                }

                if (handler) {
                    try {
                        handler(player, data)
                    } catch (error) {
                        console.log({ player: player.getId(), error: error })
                    }
                } else if (data.type == 'ping') {
                    messenger.send('ping')
                }
            })

            if (closeMethod) {
                ws.on('close', (event) => {
                    closeMethod(player, event)
                })
            }
        })
    }
}