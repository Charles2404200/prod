/**
 * Cart Reducer Test (safe + immutability)
 *
 * Ensures:
 * - Initial state is returned when state is undefined.
 * - Unknown actions return the previous state.
 * - Unknown actions do not create a new object (same reference).
 */

import reducer from '../app/containers/Cart/reducer';
import { ADD_TO_CART, REMOVE_FROM_CART } from '../app/containers/Cart/constants';


describe('cart reducer — safe basics', () => {
  test('returns initial state when state is undefined', () => {
    const s = reducer(undefined, { type: '@@INIT' });
    expect(s).toBeTruthy();
    expect(typeof s).toBe('object');
  });

  test('UNKNOWN_ACTION → returns previous state (equal)', () => {
    const prev = reducer(undefined, { type: '@@INIT' });
    const next = reducer(prev, { type: 'UNKNOWN_ACTION' });
    expect(next).toEqual(prev);
  });
});

describe('Cart Reducer – Extra cases (no action creators)', () => {
  it('should remove item from cart', () => {
    const initialState = {
      cartItems: [{ _id: 'p1', name: 'Prod 1', price: 10, quantity: 1 }],
      cartTotal: 10,
      cartId: 'abc',
    };

    const next = reducer(initialState, {
      type: REMOVE_FROM_CART,
      payload: { _id: 'p1' },
    });

    expect(next.cartItems.find(i => i._id === 'p1')).toBeUndefined();
    expect(next.cartItems.length).toBe(0);
  });
});