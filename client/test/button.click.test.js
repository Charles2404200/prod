/**
 * Button Interaction Test
 *
 * Verifies that the Button calls onClick when pressed,
 * and does not trigger onClick if it is disabled.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../app/components/Common/Button';

describe('Button (interaction)', () => {
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Buy" onClick={handleClick} />);
    fireEvent.click(screen.getByText(/buy/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button text="Buy" onClick={handleClick} disabled />);
    fireEvent.click(screen.getByText(/buy/i));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
