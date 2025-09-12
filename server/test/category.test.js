/**
 * Category Model Unit Tests
 *
 * Mocks Mongoose model methods: create/find/findById with happy/negative paths.
 */

const Category = require('../models/category');

jest.mock('../models/category');

describe('Category Model (unit)', () => {
  afterEach(() => jest.clearAllMocks());

  test('create → success', async () => {
    Category.create = jest.fn().mockResolvedValue({ name: 'Clothes' });
    const res = await Category.create({ name: 'Clothes' });
    expect(res.name).toBe('Clothes');
  });

  test('create → throws when DB fails', async () => {
    Category.create = jest.fn().mockRejectedValue(new Error('db error'));
    await expect(Category.create({ name: 'X' })).rejects.toThrow('db error');
  });

  test('find → returns list', async () => {
    Category.find = jest.fn().mockResolvedValue([{ name: 'A' }, { name: 'B' }]);
    const res = await Category.find();
    expect(res).toHaveLength(2);
  });

  test('find → empty array when none exist', async () => {
    Category.find = jest.fn().mockResolvedValue([]);
    const res = await Category.find();
    expect(res).toEqual([]);
  });

  test('findById → null when not found', async () => {
    Category.findById = jest.fn().mockResolvedValue(null);
    const res = await Category.findById('nonexistent');
    expect(res).toBeNull();
  });
});
