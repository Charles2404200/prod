/**
 * Button Smoke Test
 *
 * Makes sure the Button renders text correctly
 * and applies a custom className when provided.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock out sub-components if they exist
jest.mock('../app/components/Common/Tooltip', () => () => null);
jest.mock('../app/components/Common/Popover', () => () => null);

import Button from '../app/components/Common/Button';

describe('Button (smoke)', () => {
  test('renders text', () => {
    render(<Button text="Buy now" />);
    expect(screen.getByText(/buy now/i)).toBeInTheDocument();
  });

  test('applies className', () => {
    const { container } = render(<Button text="Go" className="extra" />);
    expect(container.firstChild).toHaveClass('extra');
  });
});
