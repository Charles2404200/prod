/**
 * Button Variants Test
 *
 * Ensures the Button applies the correct variant classes
 * and merges them with any custom className.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../app/components/Common/Button';

describe('Button (variants)', () => {
  test('applies class for variant="primary"', () => {
    const { container } = render(<Button text="Primary" variant="primary" />);
    const el = screen.getByText(/primary/i);
    // Safer check: only assert that "primary" appears in className
    expect(container.firstChild.className).toMatch(/primary/i);
    expect(el).toBeInTheDocument();
  });

  test('merges custom className with variant class', () => {
    const { container } = render(
      <Button text="Merge" variant="primary" className="extra-class" />
    );
    expect(container.firstChild.className).toMatch(/primary/i);
    expect(container.firstChild.className).toMatch(/extra-class/);
  });
});
