/**
 * Auth Service Unit Tests (mock style)
 *
 * These tests only check our mocked behavior for User, bcrypt, and jwt.
 * We don't actually run the real login service here.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

jest.mock('../models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service (mock only)', () => {
  afterEach(() => jest.clearAllMocks());

  test('register → creates new user (mocked save)', async () => {
    User.prototype.save = jest.fn().mockResolvedValue({ _id: 'u1', email: 'a@b.com' });
    const user = new User({ email: 'a@b.com', password: '123' });

    const res = await user.save();
    expect(res).toEqual({ _id: 'u1', email: 'a@b.com' });
    expect(User.prototype.save).toHaveBeenCalled();
  });

  test('register → fails when save throws', async () => {
    User.prototype.save = jest.fn().mockRejectedValue(new Error('db error'));
    const user = new User({ email: 'a@b.com', password: '123' });

    await expect(user.save()).rejects.toThrow('db error');
    expect(User.prototype.save).toHaveBeenCalled();
  });

  test('bcrypt.compare → resolves true', async () => {
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const ok = await bcrypt.compare('123', 'hashed');
    expect(ok).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('123', 'hashed');
  });

  test('bcrypt.compare → resolves false', async () => {
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    const ok = await bcrypt.compare('wrong', 'hashed');
    expect(ok).toBe(false);
    expect(bcrypt.compare).toHaveBeenCalledWith('wrong', 'hashed');
  });

  test('jwt.sign → returns fake token', () => {
    jwt.sign = jest.fn().mockReturnValue('jwt-token');

    const token = jwt.sign({ id: 'u1' }, 'secret');
    expect(token).toBe('jwt-token');
    expect(jwt.sign).toHaveBeenCalled();
  });

  test('jwt.sign → throws error', () => {
    jwt.sign = jest.fn(() => { throw new Error('jwt fail'); });

    expect(() => jwt.sign({}, 'secret')).toThrow('jwt fail');
    expect(jwt.sign).toHaveBeenCalled();
  });
});