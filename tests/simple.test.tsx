// tests/simple.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";
import UserList from "../src/components/UserList";


// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

test("renders the user list", () => {
    render(<UserList users={[{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Doe" }]} />);
  
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });