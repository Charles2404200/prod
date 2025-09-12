/**
 * Utils: asyncForEach
 *
 * Ensures asyncForEach runs callbacks sequentially and handles edge cases.
 */

const { asyncForEach } = require('../utils/utils');

describe('Utility: asyncForEach', () => {
  it('runs callback sequentially and accumulates result', async () => {
    const arr = [1, 2, 3];
    let sum = 0;
    const cb = async (n) => {
      await new Promise((r) => setTimeout(r, 10));
      sum += n;
    };
    await asyncForEach(arr, cb);
    expect(sum).toBe(6);
  });

  it('throws if callback is missing', async () => {
    const arr = [1, 2, 3];
    await expect(async () => {
      await asyncForEach(arr, null);
    }).rejects.toThrow();
  });

  it('works with single-element array', async () => {
    let result = 0;
    await asyncForEach([42], async (n) => { result += n; });
    expect(result).toBe(42);
  });
});

describe('asyncForEach – Extra cases', () => {
  it('should not call callback for empty array', async () => {
    const mockFn = jest.fn();
    await asyncForEach([], mockFn);
    expect(mockFn).not.toHaveBeenCalled();
  });
});
