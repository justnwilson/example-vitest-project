import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

let mockUsers = vi.hoisted(() => [
  { id: 1, name: "Leanne Graham" },
]);

const mockUserService = vi.hoisted(() => ({
  create: vi.fn(({ name }) => {
    console.log(">>> create")
    const newUser = { id: mockUsers.length + 1, name };
    mockUsers.push(newUser);
    return Promise.resolve({ data: newUser });
  }),
  delete: vi.fn((id) => {
    console.log(">>> delete")
    mockUsers = mockUsers.filter((user) => user.id !== id);
    return Promise.resolve();
  }),
  update: vi.fn((updatedUser) => {
    console.log(">>> update")
    mockUsers = mockUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    return Promise.resolve();
  }),
  getAll: vi.fn(() => {
    console.log(">>> fetch")
    return {
      request: Promise.resolve({ data: mockUsers }), // This resolves with mock data
      cancel: vi.fn(), // You can mock the cancel function, though it's not used in the test
    };
  }),
}));

// Mock the user service
vi.mock("../src/services/user-service", () => ({
  default: mockUserService
}));


import userService from "../src/services/user-service";
import UserList from "../src/components/UserList";


// clears the mock before each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe("UserList", () => {
  console.log("This is the delete log:", userService.delete(1));

  it("deletes a user when the delete button is clicked", async () => {
    render(<UserList />);

    // Wait for users to be displayed
    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    });

    // Click the first delete button
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    console.log("Mock calls:", (userService.delete as Mock).mock.calls);
    expect(userService.delete).toHaveBeenCalledTimes(1);

    // Wait for user to be removed from UI
    await waitFor(() => {
      expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
    });
  });
});
