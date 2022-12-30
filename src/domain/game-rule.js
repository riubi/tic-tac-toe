export default class ClassicRule {
    #winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    #winnerIndex = -1
    #size = 3
    #map

    constructor() {
        this.#map = new Map()

        for (let i = 0; i < Math.pow(this.#size, 2); i++) {
            this.#map.set(i, null)
        }
    }

    /**
     * @throws {Error}
     * @param {*} position 
     * @param {*} playerIndex 
     */
    mark(position, playerIndex) {
        let isValidPosition = position < Math.pow(this.#size, 2)

        if (isValidPosition && this.#map.get(position) == null) {
            this.#map.set(position, playerIndex)
        } else {
            throw new Error('This cell is already occupied.')
        }
    }

    isGameFinished() {
        if (this.#winnerIndex > -1) {
            return true
        }

        let isDraw = true
        for (let i = 0; i < this.#winPatterns.length; i++) {
            const p = this.#winPatterns[i],
                a = this.#map.get(p[0]),
                b = this.#map.get(p[1]),
                c = this.#map.get(p[2]);

            if (a == null || b == null || c == null) {
                isDraw = false
                continue
            }

            if (a == b && b == c) {
                this.#winnerIndex = a
                return true
            }
        }

        return isDraw
    }

    /**
     * @returns {Function}
     */
    getWinStatusCallback() {
        return (index) => {
            if (this.#winnerIndex == -1) {
                return 'draw'
            }

            return index == this.#winnerIndex ? 'win' : 'lose'
        }
    }
}