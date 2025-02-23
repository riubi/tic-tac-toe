import {EventEmitter} from '../src/Domain/EventEmitter.js'
import {Game} from '../src/Domain/Game/Game.js'
import {Player} from '../src/Domain/Player/Player.js'

describe('Game', () => {
    let game,
        player1,
        player2

    beforeEach(() => {
        player1 = new Player(new EventEmitter({send: jest.fn()}))
        player2 = new Player(new EventEmitter({send: jest.fn()}))
        game = new Game([player2, player1])
    })

    it('should detect turn correctly', () => {
        game.makeMove(player1, 0)
        game.makeMove(player2, 4)
    })

    it('should throw error if not player turn', () => {
        expect(() => game.makeMove(player2, 0)).toThrow('Not this player\'s turn.')
    })

    it('should throw error if player already in game', () => {
        const emitter3 = new EventEmitter({send: jest.fn()})
        const player3 = new Player(emitter3)
        expect(() => new Game([player1, player3])).toThrow('Player already in game.')
    })
})
