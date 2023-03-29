import { Bot } from "../src/domain/bot.js"
import { Game } from "../src/domain/game.js"

describe("Bot", () => {
    let bot1
    let bot2

    beforeEach(() => {
        bot1 = new Bot()
        bot2 = new Bot()
    })

    test("bot has a nickname", () => {
        expect(bot1.getNickName()).toMatch(/^Bot #\w{3}$/)
    })

    test("bot makes a move", async () => {
        const sleep = function (ms) {
            return new Promise((resolve) => setTimeout(resolve, ms))
        }

        const game = new Game([bot1, bot2])

        expect(game.isGameFinished()).toBe(false)

        await sleep(500)

        expect(game.isGameFinished()).toBe(true)
    })
})