/**
 * TogglePanel UI Test
 * 
 * Checks that the panel starts closed, opens when the button is clicked,
 * and closes again when clicked a second time. Also makes sure aria attributes
 * update correctly.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Tiny inline component for testing only
function TogglePanel() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="panel"
        onClick={() => setOpen((o) => !o)}
      >
        Toggle details
      </button>

      <div id="panel" hidden={!open}>
        Hello, this is the content!
      </div>
    </div>
  );
}

describe('TogglePanel accessibility & interaction', () => {
  test('starts closed, toggles open and closed again', () => {
    render(<TogglePanel />);

    const btn = screen.getByRole('button', { name: /toggle details/i });
    const panel = screen.getByText(/hello, this is the content!/i);

    // Default closed
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveAttribute('hidden');

    // Open
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(panel).not.toHaveAttribute('hidden');

    // Close again
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(panel).toHaveAttribute('hidden');
  });
});
