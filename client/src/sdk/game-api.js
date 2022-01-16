export default class GameApi {
    #socket
    #handlers
    #subscriber

    /**
     * @param {String} server 
     * @param {Map<String,Function>} apiHandlers 
     */
    constructor(server) {
        this.#handlers = new Map()

        const socket = new WebSocket(server),

            fn = (data) => {
                console.log(data);
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

    setName() {
        return (name) => {
            this.send('setName', { name: name })
        }
    }

    makeMove() {
        return (position) => this.send('makeMove', { position: position });
    }

    searchGame() {
        return () => this.send('searchGame', {})
    }

    quite() {
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