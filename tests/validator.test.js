import { isValidStats, sanitizeNumber, sanitizeArray } from '../src/utils/validators.js';

describe('Validators', () => {
  test('isValidStats validates stats object structure', () => {
    const validStats = {
      totalBlocked: 0,
      bandwidthSaved: 0,
      uniqueDomains: []
    };
    
    expect(isValidStats(validStats)).toBe(true);
    expect(isValidStats({})).toBe(false);
    expect(isValidStats(null)).toBe(false);
  });

  test('sanitizeNumber handles invalid inputs', () => {
    expect(sanitizeNumber('123')).toBe(123);
    expect(sanitizeNumber(-5)).toBe(0);
    expect(sanitizeNumber(null)).toBe(0);
    expect(sanitizeNumber('abc')).toBe(0);
  });

  test('sanitizeArray removes duplicates and invalid entries', () => {
    const input = ['test.com', 'example.com', 'test.com', null, undefined];
    const expected = ['test.com', 'example.com'];
    
    expect(sanitizeArray(input)).toEqual(expected);
    expect(sanitizeArray(null)).toEqual([]);
    expect(sanitizeArray(123)).toEqual([]);
  });
});
