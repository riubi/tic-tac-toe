import {ClassicRule} from "../src/Domain/Game/ClassicRule.js";

describe('ClassicRule', () => {
    let rule;
    let board;

    beforeEach(() => {
        rule = new ClassicRule();
        board = new Map(Array.from({length: 9}, (_, i) => [i, null]));
    });

    it('should detect win patterns correctly', () => {
        board.set(0, 0);
        board.set(1, 1);
        board.set(2, 0);
        board.set(3, 1);
        board.set(4, 0);
        board.set(5, 1);
        expect(rule.checkWinner(board)).toBe(null);

        board.set(6, 0);
        expect(rule.checkWinner(board)).toBe(0);
    });
});
