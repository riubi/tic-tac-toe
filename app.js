import { WebSocketServer } from 'ws'
import Lobby from './src/domain/lobby.js'
import Router from './src/service/router.js'
import Express from 'express'
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
        player.getGamePerspective().makeMove(data)
    })
    .on('quite', (player, data) => {
        player.getGamePerspective().playerQuite()
    })
    .on('close', (player, data) => {
        lobby.disconnect(player)
    })

router.route(server)