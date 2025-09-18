/**
 * Cart Reducer Test (safe + immutability)
 *
 * Ensures:
 * - Initial state is returned when state is undefined.
 * - Unknown actions return the previous state.
 * - Unknown actions do not create a new object (same reference).
 */
// client/test/cart.reducer.test.js
import reducer from "../app/containers/Cart/reducer";
import {
  HANDLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART,
} from "../app/containers/Cart/constants";

describe("cart reducer — branches & basics", () => {
  test("add & remove item works", () => {
    const item = { _id: "p1", name: "Tee", price: 100 };

    const s1 = reducer(undefined, { type: ADD_TO_CART, payload: item });
    expect(s1.cartItems.some((x) => x._id === "p1")).toBe(true);

    const s2 = reducer(s1, { type: REMOVE_FROM_CART, payload: { _id: "p1" } });
    expect(s2.cartItems.find((x) => x._id === "p1")).toBeUndefined();
  });

  test("clear cart resets items and total", () => {
    const s1 = reducer(undefined, {
      type: ADD_TO_CART,
      payload: { _id: "p2", name: "Cap", price: 50 },
    });
    const s2 = reducer(s1, { type: CLEAR_CART });
    expect(s2.cartItems).toEqual([]);
    expect(s2.cartTotal).toBe(0);
    expect(s2.cartId).toBe("");
  });

  test("set cart id updates state", () => {
    const s1 = reducer(undefined, { type: SET_CART_ID, payload: "CART-123" });
    expect(s1.cartId).toBe("CART-123");
  });

  test("handle cart total sets numeric value", () => {
    const s1 = reducer(undefined, {
      type: ADD_TO_CART,
      payload: { _id: "p3", name: "Hoodie", price: 200 },
    });
    const s2 = reducer(s1, { type: HANDLE_CART_TOTAL, payload: 200 });
    expect(s2.cartTotal).toBe(200);
  });

  test("unknown action returns same reference (default branch)", () => {
    const base = reducer(undefined, { type: "@@INIT" });
    const next = reducer(base, { type: "NOT_EXIST" });
    expect(next).toBe(base);
  });

  test("remove non-existing item keeps items intact", () => {
    const base = reducer(undefined, { type: "@@INIT" });
    const next = reducer(base, {
      type: REMOVE_FROM_CART,
      payload: { _id: "nope" },
    });
    expect(next.cartItems).toEqual(base.cartItems);
  });

  // ===== extra branches =====

  test("HANDLE_CART replaces whole cart (correct payload shape)", () => {
    const start = reducer(undefined, { type: "@@INIT" });
    const items = [
      { _id: "x1", name: "Cap", price: 50 },
      { _id: "x2", name: "Hoodie", price: 200 },
    ];

    const next = reducer(start, {
      type: HANDLE_CART,
      payload: { cartItems: items, cartTotal: 250, cartId: "C-1" },
    });

    expect(next.cartItems.map((i) => i._id)).toEqual(["x1", "x2"]);
    expect(next.cartTotal).toBe(250);
    expect(next.cartId).toBe("C-1");
    expect(next).not.toBe(start);
  });

  test("REMOVE_FROM_CART when item exists (index >= 0)", () => {
    const seeded = reducer(undefined, {
      type: HANDLE_CART,
      payload: {
        cartItems: [
          { _id: "k1", name: "Tee", price: 100 },
          { _id: "k2", name: "Bag", price: 80 },
        ],
        cartTotal: 180,
        cartId: "C-2",
      },
    });

    const after = reducer(seeded, {
      type: REMOVE_FROM_CART,
      payload: { _id: "k1" },
    });
    expect(after.cartItems.find((x) => x._id === "k1")).toBeUndefined();
    expect(after.cartItems.find((x) => x._id === "k2")).toBeDefined();
  });

  test("ADD_TO_CART appends (duplicate allowed by current reducer)", () => {
    const s1 = reducer(undefined, {
      type: ADD_TO_CART,
      payload: { _id: "a1", name: "Sticker", price: 10 },
    });
    const s2 = reducer(s1, {
      type: ADD_TO_CART,
      payload: { _id: "a1", name: "Sticker", price: 10 },
    });
    expect(s2.cartItems.length).toBe(2);
  });
});
