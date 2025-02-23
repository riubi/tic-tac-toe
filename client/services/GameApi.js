export default class GameApi {
    #socket
    #handlers
    #subscriber

    /**
     * @param {String} server
     */
    constructor(server) {
        this.#handlers = new Map()

        const socket = new WebSocket(server),

            fn = (data) => {
                console.log(data)
                const handlers = this.#handlers.get(data.type)
                if (handlers) {
                    handlers.forEach(handler => handler(data))
                }
            }

        socket.onopen = fn
        socket.onerror = fn
        socket.onclose = fn
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data) {
                fn(data)
            } else {
                console.error("Can't parse server message: ", event)
            }
        }

        this.#socket = socket

        this.#subscriber = {
            on: (type, callback) => {
                if (!this.#handlers.has(type)) {
                    this.#handlers.set(type, [])
                }

                this.#handlers.get(type).push(callback)

                return this.#subscriber
            }
        }
    }

    setNameFn() {
        return (name) => {
            this.send('setName', {name: name})
        }
    }

    makeMoveFn() {
        return (position) => this.send('makeMove', {position: position})
    }

    searchGameFn() {
        return () => this.send('searchGame', {})
    }

    quitFn() {
        return () => this.send('quite', {})
    }

    send(type, data) {
        data.type = type
        console.log(data)
        this.#socket.send(JSON.stringify(data))
    }

    getSubscriber() {
        return this.#subscriber
    }
}