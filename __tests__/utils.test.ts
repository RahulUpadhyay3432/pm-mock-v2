import { normalizeScore, formatDuration, getScoreColor, getScoreLabel } from '@/lib/utils'

describe('Utils', () => {
  describe('normalizeScore', () => {
    it('should normalize scores correctly', () => {
      expect(normalizeScore({ a: 5, b: 5, c: 5 })).toBe(100)
      expect(normalizeScore({ a: 3, b: 3, c: 3 })).toBe(60)
      expect(normalizeScore({ a: 0, b: 0, c: 0 })).toBe(0)
      expect(normalizeScore({})).toBe(0)
    })

    it('should handle mixed scores', () => {
      expect(normalizeScore({ a: 5, b: 3, c: 2 })).toBe(67) // (5+3+2)/3 = 3.33, normalized to 67%
    })

    it('should filter out invalid values', () => {
      expect(normalizeScore({ a: 5, b: -1, c: 3 })).toBe(80) // Only 5 and 3 are valid
    })
  })

  describe('formatDuration', () => {
    it('should format duration correctly', () => {
      expect(formatDuration(0)).toBe('0:00')
      expect(formatDuration(30)).toBe('0:30')
      expect(formatDuration(60)).toBe('1:00')
      expect(formatDuration(90)).toBe('1:30')
      expect(formatDuration(3661)).toBe('61:01')
    })
  })

  describe('getScoreColor', () => {
    it('should return correct colors for score ranges', () => {
      expect(getScoreColor(90)).toBe('text-green-600')
      expect(getScoreColor(70)).toBe('text-yellow-600')
      expect(getScoreColor(40)).toBe('text-red-600')
    })
  })

  describe('getScoreLabel', () => {
    it('should return correct labels for score ranges', () => {
      expect(getScoreLabel(90)).toBe('Excellent')
      expect(getScoreLabel(70)).toBe('Good')
      expect(getScoreLabel(50)).toBe('Fair')
      expect(getScoreLabel(30)).toBe('Needs Improvement')
    })
  })
})