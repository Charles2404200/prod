// client/test/button.unit.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// If Button internally renders sub-components (e.g., Tooltip/Popover),
jest.mock('../app/components/Common/Tooltip', () => () => null);
jest.mock('../app/components/Common/Popover', () => () => null);

import Button from '../app/components/Common/Button';

describe('Button — unit (render / interaction / branches)', () => {
  it('renders a <button> element', () => {
    render(<Button>Buy Now</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<Button className="extra">Buy</Button>);
    expect(container.firstChild).toHaveClass('extra');
  });

  it('calls onClick when enabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders right-side icon branch', () => {
    const { container } = render(
      <Button icon="★" iconDirection="right" iconClassName="t-icon">
        Buy
      </Button>
    );
    // Presence of the icon class is enough to prove we hit the branch.
    expect(container.querySelector('.t-icon')).toBeTruthy();
  });

  it('renders the borderless branch without crashing', () => {
    const { container } = render(<Button borderless>Buy</Button>);
    expect(container.firstChild).toBeTruthy();
  });

  it('keeps custom classes alongside internal variant classes', () => {
    const { container } = render(<Button className="extra-class">Buy</Button>);
    expect(container.firstChild.className).toMatch(/extra-class/);
  });
});
