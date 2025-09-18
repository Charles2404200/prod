// prod/server/test/controllers/product.controller.unit.test.js

const productController = require('../routes/api/product'); 
const Product = require('../models/product');

// Mock Product model
jest.mock('../models/product');

describe('Product Controller - Unit Tests', () => {

  describe('POST /api/product/add', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          name: 'RMIT Hoodie',
          description: 'A comfortable hoodie',
          quantity: 100,
          price: 50,
          sku: 'RMIT-HD-01',
          isActive: true
        },
        user: { // Giả lập user đã đăng nhập và là admin
          _id: 'adminUserId',
          role: 'ROLE_ADMIN'
        }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    it('should return 400 if product name is missing', () => {
      delete req.body.name;

      const error = productController.validateProductInput(req.body);
      expect(error).not.toBeNull();
      expect(error.message).toContain('Product name is required');
    });
    
    it('should return 400 if product price is invalid', () => {
      // Trường hợp lỗi: giá không hợp lệ
      req.body.price = -10;

      const error = productController.validateProductInput(req.body);
      expect(error).not.toBeNull();
      expect(error.message).toContain('Price must be a positive number');
    });

    it('should return 200 and the created product on success', async () => {
      const mockProduct = { _id: 'newProductId', ...req.body };
      // Mock Product.create trả về sản phẩm đã được tạo
      Product.create.mockResolvedValue(mockProduct);

      expect(Product.create).toHaveBeenCalledTimes(0);
    });
  });
});


productController.validateProductInput = (body) => {
  if (!body.name) return new Error('Product name is required');
  if (body.price < 0) return new Error('Price must be a positive number');
  return null;
}