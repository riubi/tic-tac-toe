import { v4 as uuidv4 } from 'uuid'

class Util {
    /**
     * @returns {String}
     */
    static uuid = uuidv4

    /**
     * @param {*} value 
     * @returns {Boolean}
     */
    static isNull(value) {
        return typeof value === "object" && !value
    }

    /**
     * @param {Integer} max 
     * @returns {Integer}
     */
    static getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }
}

export { Util }