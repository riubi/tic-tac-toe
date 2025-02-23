import {WebSocketServer} from 'ws'
import {Lobby} from './Domain/Lobby/Lobby.js'
import {Router} from './Service/Router.js'
import Express from 'express'
import Config from 'config'

const PORT = process.env.PORT || Config.get('port')
const HOST = Config.get('host')

console.info(`Starting listen on ${HOST}:${PORT}`)

const expressServer = Express()
    .listen(PORT, HOST, () => console.info(`Listening on ${HOST}:${PORT}`))

const
    server = new WebSocketServer({ server: expressServer }),
    router = new Router(Config.get('debug')),
    lobby = new Lobby()
    lobby.start()

router
    .on('connect', (player, data) => {
        lobby.connect(player)
    })
    .on('setName', (player, data) => {
        player.setNickName(data.name)
    })
    .on('searchGame', (player, data) => {
        lobby.searchAndStartGame(player)
    })
    .on('makeMove', (player, data) => {
        player.makeMove(parseInt(data.position))
    })
    .on('quite', (player, data) => {
        player.quit()
    })
    .on('close', (player, data) => {
        lobby.disconnect(player)
    })

router.route(server)
