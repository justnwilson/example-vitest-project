import { describe, it, expect, vi, beforeEach, Mock } from "vitest";

// Mock the user service
vi.mock("../services/user-service", () => ({
  create: vi.fn(({ name }) => {
    const newUser = { id: mockUsers.length + 1, name };
    mockUsers.push(newUser);
    return Promise.resolve({ data: newUser });
  }),
  delete: vi.fn((id) => {
    mockUsers = mockUsers.filter((user) => user.id !== id);
    return Promise.resolve();
  }),
  update: vi.fn((updatedUser) => {
    mockUsers = mockUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    return Promise.resolve();
  }),
  getAll: vi.fn(() => {
    return {
      request: Promise.resolve({ data: mockUsers }), // This resolves with mock data
      cancel: vi.fn(), // You can mock the cancel function, though it's not used in the test
    };
  }),
}));




import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserList from "../src/components/UserList";
import "@testing-library/jest-dom";
import React from "react";
import userService from "../src/services/user-service";


let mockUsers = [
  { id: 1, name: "Leanne Graham" },
];

// clears the mock before each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe("UserList", () => {
  console.log("This is the delete log:", userService.delete);

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