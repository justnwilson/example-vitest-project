import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserList from "../src/components/UserList";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import React from "react";

// Mock user service
vi.mock("../services/user-service", () => ({
  create: vi.fn(() =>
    Promise.resolve({ data: { id: 1, name: "Jdog" } })
  ),
  delete: vi.fn(() => Promise.resolve()),
  update: vi.fn(() => Promise.resolve()),
}));

describe("UserList", async () => {
  it("adds a user when the Add button is clicked", async () => {
    render(<UserList />);

    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Jdog")).toBeInTheDocument();
    });
  });
});
