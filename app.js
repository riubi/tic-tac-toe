import { WebSocketServer } from 'ws'
import { Lobby } from './api/domain/lobby.js'
import Express from 'express'
import Router from './api/service/router.js'
import Config from 'config'

const PORT = process.env.PORT || Config.get('port'),
    HOST = Config.get('host')

const expressServer = Express()
    .listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));

const
    server = new WebSocketServer({ server: expressServer }),
    router = new Router(Config.get('debug')),
    lobby = new Lobby()

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
        player.makeMove(data)
    })
    .on('quite', (player, data) => {
        player.playerQuite()
    })
    .on('close', (player, data) => {
        lobby.disconnect(player)
    })

router.route(server)