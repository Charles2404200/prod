// server/test/utils.unit.test.js

/**
 * Merged: utils.test.js + utils.asyncForEach.unit.test.js
 *
 * All tests target asyncForEach, so we consolidate them here.
 */

const { asyncForEach } = require('../utils/utils'); // Adjust path if needed

describe('Utility: asyncForEach (sequential + edge cases)', () => {
  it('runs the callback sequentially and accumulates a result', async () => {
    const arr = [1, 2, 3];
    let sum = 0;
    const cb = async (n) => {
      await new Promise((r) => setTimeout(r, 10));
      sum += n;
    };
    await asyncForEach(arr, cb);
    expect(sum).toBe(6);
  });

  it('works with a single-element array', async () => {
    let result = 0;
    await asyncForEach([42], async (n) => { result += n; });
    expect(result).toBe(42);
  });

  it('does not call the callback for an empty array', async () => {
    const mockFn = jest.fn();
    await asyncForEach([], mockFn);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('calls the callback in order (trace calls)', async () => {
    const calls = [];
    const cb = jest.fn(async (item, idx) => {
      await new Promise(r => setTimeout(r, 5));
      calls.push({ item, idx });
    });
    const arr = [1, 2, 3];

    await asyncForEach(arr, cb);

    expect(cb).toHaveBeenCalledTimes(3);
    expect(calls).toEqual([
      { item: 1, idx: 0 },
      { item: 2, idx: 1 },
      { item: 3, idx: 2 },
    ]);
  });
});
