// server/test/middlewares.auth-guards.unit.test.js

function dummyMiddleware(req, res, next) {
  req.tested = true;
  next();
}

describe('Dummy middleware', () => {
  test('sets a flag on req and calls next()', () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    dummyMiddleware(req, res, next);

    expect(req.tested).toBe(true);
    expect(next).toHaveBeenCalled();
  });
});

/* ===== headerGuard middleware ===== */
function headerGuard(req, res, next) {
  if (req.headers['x-app-key'] === 'RMIT') return next();
  res.status(401).json({ error: 'unauthorized' });
}

describe('headerGuard middleware', () => {
  test('passes when header is valid', () => {
    const req = { headers: { 'x-app-key': 'RMIT' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    headerGuard(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('blocks when header is missing/invalid', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    headerGuard(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'unauthorized' });
  });
});
