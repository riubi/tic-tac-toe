import { ClassicRule } from '../src/domain/game.js'

describe('ClassicRule', () => {
    let rule

    beforeEach(() => {
        rule = new ClassicRule()
    })

    it('should initialize correctly', () => {
        expect(rule.isGameFinished()).toBe(false)
    })

    it('should mark positions correctly', () => {
        rule.mark(0, 0)
        expect(() => rule.mark(0, 1)).toThrow('This cell is already occupied.')
        expect(rule.isGameFinished()).toBe(false)
    })

    it('should detect win patterns correctly', () => {
        rule.mark(0, 0)
        rule.mark(1, 1)
        rule.mark(2, 0)
        rule.mark(3, 1)
        rule.mark(4, 0)
        rule.mark(5, 1)
        expect(rule.isGameFinished()).toBe(false)

        rule.mark(6, 0)
        expect(rule.isGameFinished()).toBe(true)
        expect(rule.getWinStatusCallback()(0)).toBe('win')
        expect(rule.getWinStatusCallback()(1)).toBe('lose')
    })
})