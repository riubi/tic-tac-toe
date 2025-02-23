import {EventEmitter} from '../src/Domain/EventEmitter.js'
import {Game} from '../src/Domain/Game/Game.js'
import {Lobby} from '../src/Domain/Lobby/Lobby.js'
import {Player} from '../src/Domain/Player/Player.js'

describe('Lobby', () => {
    let lobby
    let player1
    let player2

    beforeEach(() => {
        player1 = new Player(new EventEmitter({send: jest.fn()}))
        player2 = new Player(new EventEmitter({send: jest.fn()}))
        lobby = new Lobby()
    })

    it('should connect and disconnect players correctly', () => {
        lobby.connect(player1)
        lobby.searchAndStartGame(player1)
        lobby.searchAndStartGame(player2)
        lobby.disconnect(player1)

        expect(player2.hasActiveGame()).toBe(false)
    })

    it('should start game correctly', () => {
        lobby.searchAndStartGame(player1)
        lobby.searchAndStartGame(player2)
        lobby.startGameIfPossible()

        expect(player1.hasActiveGame()).toBe(true)
        expect(player2.hasActiveGame()).toBe(true)
        expect(() => lobby.searchAndStartGame(player1)).toThrow('Player already has active game.')
    })

    it('should throw error if player has active game', () => {
        new Game([player1, player2])

        expect(() => lobby.searchAndStartGame(player1)).toThrow('Player already has active game.')
    })
})
