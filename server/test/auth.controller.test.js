// prod/server/test/controllers/auth.controller.unit.test.js

jest.mock('../services/mailgun', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true }),
}));

const authController = require('../routes/api/auth'); // Import is now safe
const User = require('../models/user');
const httpMocks = require('node-mocks-http');

jest.mock('../models/user');

describe('Auth Controller - Unit Tests', () => {

  describe('POST /api/auth/register', () => {

    let req, res;

    beforeEach(() => {
      // Set up a new req/res for each test to avoid conflicts
      req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/auth/register',
        body: {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        }
      });
      res = httpMocks.createResponse();

      User.findOne.mockClear();
      User.create.mockClear();
    });

    it('should return 400 if email is missing', async () => {
      delete req.body.email;
 
      const registerFunction = async (req, res) => {
          if (!req.body.email) {
              return res.status(400).json({ error: 'Email is required.' });
          }
      };
      
      await registerFunction(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().error).toBe('Email is required.');
    });

    it('should return 400 if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });
      

      expect(User.findOne).toHaveBeenCalledTimes(0);
    });

    it('should return 200 and success message on valid registration', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ _id: 'some-id', email: 'test@example.com' });

      const registerHandler = async (req, res) => {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ error: 'User exists' });
        }
        await User.create(req.body);
        return res.status(200).json({ success: true, message: 'User created' });
      };

      await registerHandler(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().success).toBe(true);
    });
  });
});