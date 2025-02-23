import {EventEmitter} from '../src/Domain/EventEmitter.js';
import {Game} from '../src/Domain/Game/Game.js';
import {Player} from '../src/Domain/Player/Player.js';

describe('Player', () => {
    let player1,
        player2;

    beforeEach(() => {
        player1 = new Player(new EventEmitter({send: jest.fn()}));
        player2 = new Player(new EventEmitter({send: jest.fn()}));
    });

    it('should set and get nickname correctly', () => {
        player1.setNickName('Player1');
        expect(player1.getNickName()).toBe('Player1');
    });

    it('should attach and detach game correctly', () => {
        expect(player1.hasActiveGame()).toBe(false);

        const game = new Game([player1, player2]);
        expect(player1.hasActiveGame()).toBe(true);

        game.finishGame(() => "no reason.");
        expect(player1.hasActiveGame()).toBe(false);
    });

    it('should make move and finish game correctly', () => {
        const game = new Game([player2, player1]);

        player1.makeMove(0);
        expect(() => player1.makeMove(0)).toThrow('Not this player\'s turn.');

        player1.quit();
        expect(player1.hasActiveGame()).toBe(false);
    });
});
