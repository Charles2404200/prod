// client/test/button.a11y.unit.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock possible sub-components to keep focus on Button’s a11y surface
jest.mock("../app/components/Common/Tooltip", () => () => null);
jest.mock("../app/components/Common/Popover", () => () => null);

import Button from "../app/components/Common/Button";

describe("Button — accessibility / ARIA", () => {
  it("exposes an accessible name when ariaLabel is provided", () => {
    render(<Button ariaLabel="Add to cart">Add to cart</Button>);
    // IMPORTANT: Your Button uses ariaLabel for the accessible name.
    // Children text alone does not set the name by default.
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  it("conveys disabled state", () => {
    render(<Button disabled>Disabled state</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
