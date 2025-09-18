// prod/server/test/utils.store.unit.test.js

// Import toàn bộ module 'store' để đảm bảo tính ổn định
const store = require('../utils/store');

// Mock the tax config để có một mức thuế cố định và dễ đoán cho các bài test
jest.mock('../config/tax', () => ({
  stateTaxRate: 10, // Sử dụng mức thuế 10% để dễ tính toán
}));

describe('Store Utils', () => {

  //--- Test suite cho hàm caculateItemsSalesTax ---
  describe('caculateItemsSalesTax', () => {
    
    // BÀI TEST ĐÃ ĐƯỢC KHÔI PHỤC
    test('should return an empty array if no items are provided', () => {
      const items = [];
      const result = store.caculateItemsSalesTax(items);
      expect(result).toEqual([]);
    });

    // BÀI TEST ĐÃ ĐƯỢC KHÔI PHỤC
    test('should calculate totalPrice correctly for a non-taxable item', () => {
      const items = [{ price: 100, quantity: 2, taxable: false }];
      const result = store.caculateItemsSalesTax(items);
      expect(result[0].totalPrice).toBe(200.00);
      expect(result[0].totalTax).toBe(0);
      expect(result[0].priceWithTax).toBe(0);
    });

    test('should calculate totalPrice, totalTax, and priceWithTax for a taxable item', () => {
      const items = [{ price: 100, quantity: 2, taxable: true }];
      const result = store.caculateItemsSalesTax(items);
      expect(result[0].totalPrice).toBe(200.00);
      expect(result[0].totalTax).toBe(2000.00); 
      expect(result[0].priceWithTax).toBe(2200.00);
    });

    // BÀI TEST ĐÃ ĐƯỢC KHÔI PHỤC
    test('should correctly calculate totals for multiple items', () => {
      const items = [
        { price: 10, quantity: 2, taxable: false },
        { price: 50, quantity: 1, taxable: true },
      ];
      const result = store.caculateItemsSalesTax(items);
      expect(result).toHaveLength(2);
      expect(result[0].totalPrice).toBe(20);
      expect(result[1].totalPrice).toBe(50);
    });

    // BÀI TEST ĐÃ ĐƯỢC KHÔI PHỤC
    test('should handle items with zero quantity or price', () => {
      const items = [
        { price: 100, quantity: 0, taxable: true },
        { price: 0, quantity: 5, taxable: true },
      ];
      const result = store.caculateItemsSalesTax(items);
      expect(result[0].totalPrice).toBe(0);
      expect(result[1].totalPrice).toBe(0);
    });
  });

  //--- Test suite cho hàm caculateOrderTotal ---
  describe('caculateOrderTotal', () => {
    test('should calculate the correct total for an order', () => {
      const order = {
        products: [
          { totalPrice: 150, status: 'Processing' },
          { totalPrice: 50, status: 'Shipped' },
        ],
      };
      const total = store.caculateOrderTotal(order);
      expect(total).toBe(200);
    });

    test('should ignore items with "Cancelled" status', () => {
      const order = {
        products: [
          { totalPrice: 150, status: 'Processing' },
          { totalPrice: 50, status: 'Cancelled' },
          { totalPrice: 100, status: 'Delivered' },
        ],
      };
      const total = store.caculateOrderTotal(order);
      expect(total).toBe(250);
    });

    test('should return 0 if there are no products', () => {
      const order = { products: [] };
      const total = store.caculateOrderTotal(order);
      expect(total).toBe(0);
    });
  });

  //--- Test suite cho hàm caculateTaxAmount ---
  describe('caculateTaxAmount', () => {
    test('should calculate tax correctly for an order with taxable products', () => {
      const order = {
        products: [{
          product: { taxable: true },
          purchasePrice: 100,
          quantity: 2,
          totalTax: 0,
          priceWithTax: 0,
          status: 'Processing',
        }],
      };
      const result = store.caculateTaxAmount(order);
      expect(result.totalTax).toBe(2000);
      expect(result.products[0].totalTax).toBe(2000);
      expect(result.total).toBe(200);
      expect(result.totalWithTax).toBe(2200);
    });

    test('should not add tax for non-taxable products', () => {
      const order = {
        products: [{
          product: { taxable: false },
          purchasePrice: 100,
          quantity: 2,
          totalTax: 0,
          priceWithTax: 0,
          status: 'Processing',
        }],
      };
      const result = store.caculateTaxAmount(order);
      expect(result.totalTax).toBe(0);
      expect(result.total).toBe(200);
      expect(result.totalWithTax).toBe(200);
    });
  });
});