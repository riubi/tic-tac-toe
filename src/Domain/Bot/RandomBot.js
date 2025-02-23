import {AbstractBot} from "./AbstractBot.js";

/**
 * Represents a bot that makes random moves in the game.
 */
class RandomBot extends AbstractBot {
    /** @override */
    _getBotName() {
        return "RandomBot";
    }

    /** @override */
    _makeBestMove(board) {
        let filteredEntries = [];

        board.forEach((value, key) => {
            value === null && filteredEntries.push(key);
        });

        let randomIndex = Math.floor(Math.random() * filteredEntries.length);
        this.makeMove(filteredEntries[randomIndex]);
    }
}

export {RandomBot};
