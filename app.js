import { WebSocketServer } from 'ws'
import { Lobby } from './api/domain/lobby.js'
import Router from './api/service/router.js'
import Config from 'config'

const
    server = new WebSocketServer({
        port: Config.get('port')
    }),
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
    .on('close', (player, data) => {
        lobby.disconnect(player)
    })

router.route(server)