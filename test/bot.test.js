import {Game} from "../src/Domain/Game/Game.js"
import {RandomBot} from "../src/Domain/Bot/RandomBot.js";

describe("Bot", () => {
    let bot1;
    let bot2;

    beforeEach(() => {
        bot1 = new RandomBot();
        bot2 = new RandomBot();
    });

    it("bot has a nickname", () => {
        expect(bot1.getNickName()).toMatch(/^RandomBot #\w{3}$/);
    });

    it("bot makes a move", async () => {
        const sleep = function (ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }

        const game = new Game([bot1, bot2]);

        expect(game.isGameFinished()).toBe(false);

        await sleep(250);

        expect(game.isGameFinished()).toBe(true);
    });
});
