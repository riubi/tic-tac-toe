/**
 * Stores and manages the history of game moves.
 */
class GameHistory {
    /**
     * List of recorded moves.
     * @type {Array<{playerIndex: number, move: number, board: Map<number, number|null>}>}
     */
    #history = [];

    /**
     * Records a move in the game history.
     * @param {number} playerIndex - The index of the player making the move.
     * @param {number} move - The position of the move.
     * @param {Map<number, number|null>} board - The board state at the move.
     */
    recordMove(playerIndex, move, board) {
        this.#history.push({playerIndex: playerIndex, move: move, board: new Map(board)});
    }

    /**
     * Retrieves the game history.
     * @returns {Array<{playerIndex: number, move: number, board: Map<number, number|null>}>} The history of moves.
     */
    get() {
        return this.#history;
    }

    /**
     * Logs the move history.
     */
    logHistory() {
        console.log("Game History:");
        this.#history.forEach((state, index) => {
            this.#logBoard(state);
        });
    }

    /**
     * Logs the board state for a given move.
     * @param {{playerIndex: number, move: number, board: Map<number, number|null>}} state - The game state at a particular move.
     */
    #logBoard(state) {
        const symbols = {
            '': " ",
            0: "O",
            1: "X",
        };

        const board = state.board;
        const size = Math.sqrt(board.size);

        let line = "|-----"
        for (let i = 1; i < size; i++) {
            line += "+-----";
        }
        line += "|\n";

        let output = "";
        let symbol = "";
        for (let i = 0; i < board.size; i++) {
            symbol = state.move === i
                ? "[" + symbols[state.playerIndex] + "]"
                : (board.get(i) !== null
                    ? " " + symbols[board.get(i)] + " "
                    : "   ");

            output += `| ${symbol} `;

            if ((i + 1) % size === 0) {
                output += "|\n" + line;
            }
        }

        console.log(line + output);
    }
}

export {GameHistory};
