/**
 * Button Accessibility Test (advanced)
 *
 * Checks that the Button has the correct role and accessible name,
 * and that disabled buttons can’t be interacted with.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../app/components/Common/Button';

describe('Button (a11y advanced)', () => {
  test('has role="button" and accessible name from text', () => {
    render(<Button text="Checkout now" />);
    const btn = screen.getByRole('button', { name: /checkout now/i });
    expect(btn).toBeInTheDocument();
  });

  test('disabled → should not be interactive', () => {
    render(<Button text="Pay" disabled />);
    const btn = screen.getByRole('button', { name: /pay/i });
    expect(btn).toBeDisabled();
  });
});
