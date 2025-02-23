/**
 * Implements the classic Tic-Tac-Toe game rules.
 */
class ClassicRule {
    /**
     * Total number of cells on the board.
     * @type {number}
     */
    size = 9;

    /**
     * Winning patterns in a 3x3 grid.
     * @type {number[][]}
     */
    #winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    /**
     * Check if a player has won the game.
     * @param {Map<number, number>} board - The current board state.
     */
    checkWinner(board) {
        for (const [a, b, c] of this.#winPatterns) {
            if (board.get(a) !== null && board.get(a) === board.get(b) && board.get(b) === board.get(c)) {
                return board.get(a);
            }
        }

        return null;
    }

    /**
     * Gets the board size.
     * @returns {number} The total number of cells on the board.
     */
    getSize() {
        return this.size;
    }
}

export {ClassicRule};
