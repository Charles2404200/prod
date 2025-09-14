// prod/server/test/controllers/product.error.unit.test.js

const httpMocks = require('node-mocks-http');
const Product = require('../models/product');

jest.mock('../models/product');

describe('Product Controller - Error Cases', () => {

  const addProductHandler = async (req, res) => {
    const { name, price, quantity } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Product name is required.' });
    }
    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative.' });
    }
    if (typeof quantity !== 'number') {
        return res.status(400).json({ message: 'Quantity must be a number.' });
    }
    
    const newProduct = new Product(req.body);
    await newProduct.save();
    return res.status(200).json({ product: newProduct });
  };


  it('should return 400 when trying to add a product with a negative price', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/api/product/add',
      body: {
        name: 'Faulty Product',
        price: -50, 
        quantity: 10
      }
    });
    const res = httpMocks.createResponse();

    await addProductHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe('Price cannot be negative.');
  });


  it('should return 400 when product name is missing', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/api/product/add',
      body: {
        price: 99,
        quantity: 5
      }
    });
    const res = httpMocks.createResponse();

    await addProductHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe('Product name is required.');
  });


  it('should return 400 when quantity is not a number', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/api/product/add',
      body: {
        name: 'Another Product',
        price: 25,
        quantity: 'ten' 
      }
    });
    const res = httpMocks.createResponse();

    await addProductHandler(req, res);
    
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe('Quantity must be a number.');
  });

});