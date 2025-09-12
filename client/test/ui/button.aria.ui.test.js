/**
 * Button UI Test
 *
 * Makes sure the Button handles aria-labels for accessibility
 * and reflects disabled state correctly.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../../app/components/Common/Button';

describe('Button (UI aria & props)', () => {
  test('uses ariaLabel prop as accessible name', () => {
    render(<Button text="Hidden text" ariaLabel="Pay securely" />);
    
    // Accessible name should come from aria-label, not the text prop
    const btn = screen.getByRole('button', { name: /pay securely/i });
    expect(btn).toBeInTheDocument();
  });

  test('disabled → should be disabled', () => {
    render(<Button text="Disabled state" disabled />);
    const btn = screen.getByRole('button', { name: /disabled state/i });
    expect(btn).toBeDisabled();
  });
});
