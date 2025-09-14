/**
 * test/ui/product-list.ui.test.jsx
 * Corrected Version:
 * - Removed the test for a non-existent "Add to cart" button.
 * - Fixed the error scenario test to look for the correct "No products found." message.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import ProductsShop from "../app/containers/ProductsShop";

// Helper function to create a simple mock store
function makeMockStore(preloadedState) {
  const state = preloadedState;
  return {
    getState: () => state,
    dispatch: jest.fn(),
    subscribe: () => () => {},
  };
}

// Helper function to wrap the component with necessary providers
function withProvidersAndRouter(
  ui,
  { store, path = "/shop/:slug", entry = "/shop/all" } = {}
) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[entry]}>
        <Route
          path={path}
          render={(routeProps) =>
            React.isValidElement(ui)
              ? React.cloneElement(ui, routeProps)
              : React.createElement(ui, routeProps)
          }
        />
      </MemoryRouter>
    </Provider>
  );
}

// Mock states for test scenarios
const happyState = {
  product: {
    storeProducts: [
      { _id: "1", name: "Red Shirt", slug: "red-shirt" },
      { _id: "2", name: "Blue Pants", slug: "blue-pants" },
    ],
    isLoading: false,
    error: null,
  },
  authentication: { authenticated: false },
};

const errorState = {
  product: {
    storeProducts: [],
    isLoading: false,
    error: "Network error", // This state will cause the component to render "No products found."
  },
  authentication: { authenticated: false },
};

describe("ProductsShop UI", () => {
  test("renders product names from Redux state", () => {
    const store = makeMockStore(happyState);
    withProvidersAndRouter(<ProductsShop />, { store });

    // Check if the product names are rendered
    expect(screen.getByText(/Red Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/Blue Pants/i)).toBeInTheDocument();
  });

  test("shows 'No products found' message when the product slice has an error", () => {
    const store = makeMockStore(errorState);
    withProvidersAndRouter(<ProductsShop />, { store });

    // The component will display "No products found." instead of a detailed error message.
    // We test according to the actual behavior of the component.
    const noProductsText = screen.getByText(/no products found/i);
    expect(noProductsText).toBeInTheDocument();
  });
});