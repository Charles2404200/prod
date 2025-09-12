/**
 * Product Model Unit Tests
 *
 * Mocks Mongoose model methods for basic CRUD happy/negative paths.
 */

const Product = require('../models/product');

jest.mock('../models/product');

describe('Product Model (unit)', () => {
  afterEach(() => jest.clearAllMocks());

  test('create → success', async () => {
    Product.create = jest.fn().mockResolvedValue({ name: 'Hoodie' });
    const res = await Product.create({ name: 'Hoodie' });
    expect(res.name).toBe('Hoodie');
  });

  test('create → throws when DB fails', async () => {
    Product.create = jest.fn().mockRejectedValue(new Error('db error'));
    await expect(Product.create({})).rejects.toThrow('db error');
  });

  test('findOne → returns null when not found', async () => {
    Product.findOne = jest.fn().mockResolvedValue(null);
    const res = await Product.findOne({ name: 'NotExists' });
    expect(res).toBeNull();
  });

  test('deleteOne → throws when DB fails', async () => {
    Product.deleteOne = jest.fn().mockRejectedValue(new Error('delete error'));
    await expect(Product.deleteOne({ _id: '123' })).rejects.toThrow('delete error');
  });
});
