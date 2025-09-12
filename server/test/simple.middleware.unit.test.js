/**
 * Dummy Middleware Unit Test
 *
 * Verifies the middleware sets a flag on req and calls next().
 */

function dummyMiddleware(req, res, next) {
  req.tested = true;
  next();
}

describe('Dummy middleware', () => {
  test('sets flag on req and calls next()', () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    dummyMiddleware(req, res, next);

    expect(req.tested).toBe(true);
    expect(next).toHaveBeenCalled();
  });
});
