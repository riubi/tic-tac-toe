import { Player } from "../Domain/Player/Player.js"
import { EventEmitter } from "../Domain/EventEmitter.js"
import { WebSocketServer } from "ws"

class Router {
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
            const messenger = new EventEmitter(ws),
                player = new Player(messenger)

            if (connectMethod) {
                console.info({ player: player.getId(), message: 'connected' })
                connectMethod(player)
            }

            ws.on('message', (event) => {
                let data = JSON.parse(event),
                    handler = this.#routes.get(data.type)

                if (this.#debug) {
                    console.info({ player: player.getId(), data: data })
                    messenger.emit('debug', {
                        data: data
                    })
                }

                if (handler) {
                    try {
                        handler(player, data)
                    } catch (error) {
                        console.error({ player: player.getId(), error: error })
                    }
                } else if (data.type == 'ping') {
                    messenger.emit('ping')
                }
            })

            if (closeMethod) {
                ws.on('close', (event) => {
                    console.info({ player: player.getId(), message: 'disconnected' })
                    closeMethod(player, event)
                })
            }
        })
    }
}

export { Router }