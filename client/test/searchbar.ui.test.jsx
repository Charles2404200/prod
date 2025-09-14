// prod/client/test/ui/searchbar.ui.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import SearchBar from '../app/components/Common/SearchBar';

function makeMockStore(preloadedState) {
  return {
    getState: () => preloadedState,
    dispatch: jest.fn(),
    subscribe: () => () => {},
  };
}

function renderWithProviders(ui, { store }) {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
}

const initialStoreState = {
  product: {
    searchProducts: [],
    isLoading: false,
  }
};

describe('SearchBar UI Component', () => {
  let store;

  beforeEach(() => {
    store = makeMockStore(initialStoreState);
  });

  test('should render the search input field and search button', () => {
    renderWithProviders(<SearchBar />, { store });

    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  test('should allow user to type in the search input field', () => {
    renderWithProviders(<SearchBar />, { store });

    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'RMIT Hoodie' } });

    expect(searchInput.value).toBe('RMIT Hoodie');
  });

  test('should call onSearchSubmit prop when form is submitted', () => {
    const mockOnSearchSubmit = jest.fn();

    renderWithProviders(<SearchBar onSearchSubmit={mockOnSearchSubmit} />, { store });

    const searchInput = screen.getByPlaceholderText(/Search/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });

    fireEvent.change(searchInput, { target: { value: 'RMIT Hoodie' } });
    fireEvent.click(searchButton);

    expect(mockOnSearchSubmit).toHaveBeenCalled();
  });
});