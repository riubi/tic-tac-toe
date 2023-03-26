import { WebSocketServer } from 'ws'
import { Lobby } from './src/domain/lobby.js'
import { Router } from './src/service/router.js'
import Express from 'express'
import Config from 'config'

const PORT = process.env.PORT || Config.get('port'),
    HOST = Config.get('host')

console.log(`Starting listen on ${HOST}:${PORT}`)

const expressServer = Express()
    .listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`))

const
    server = new WebSocketServer({ server: expressServer }),
    router = new Router(Config.get('debug')),
    lobby = new Lobby()
    lobby.registerBot()

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
        player.quite()
    })
    .on('close', (player, data) => {
        lobby.disconnect(player)
    })

router.route(server)
