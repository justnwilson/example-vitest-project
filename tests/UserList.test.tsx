import userService, { User } from "../src/services/user-service";
import UserList from "../src/components/UserList";

import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

let mockUsers: User[] = [
  { id: 1, name: "Leanne Graham" },
  { id: 2, name: "Ervin Howell" }
  
];

// This is still hoisted because it needs to exist before that user service is imported in UserList, which is right there
// caught and overridden by vi.mock below.
const mockUserService = vi.hoisted(() => ({
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
      cancel: vi.fn(), // Mock the cancel function, though it's not used in the test
    };
  }),
}));

// Mock the user service. As far as I can tell, this basically catches that import, and inserts
// the passed in value here for it instead. So if we were doing this in Simone we'd probably either
// mock API.js directly (which we use for most calls right now) or else upgrade those into the more
// modern "service pattern" that you see here (a service is a dedicated piece of code that just handles
// the api call for a specific record, in this case users. We are still wrapping it with RQ in useUsers.
// As you can see, having it be modular like that allows us to *only* swap out the API call code without
// impacting anything else in the codebase. Pretty cool!)
vi.mock("../src/services/user-service", () => ({
  default: mockUserService
}));

// Clears the mock before each test
beforeEach(() => {
  vi.clearAllMocks();
});


// Test to delete a user
describe("Delete", () => {

  it("deletes a user when the delete button is clicked", async () => {
    render(<UserList />);
    // Wait for users to be displayed
    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    });
    // Click the first delete button
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    expect(userService.delete).toHaveBeenCalledTimes(1);
    // Wait for user to be removed from UI
    await waitFor(() => {
      expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
    });
    });
  });


// This is a test for the add user button.
describe("Add", () => {

  // Add user test
  it("should add a user when the add button is clicked", async () => {
  render(<UserList />);
  // Wait for users to be displayed
  await waitFor(() => {
    expect(screen.getByText("Add")).toBeInTheDocument();
  });
  // Click the add button
  const addButton = screen.getByText("Add");
  fireEvent.click(addButton);
  // Wait for the new user to be displayed
  await waitFor(() => {
    expect(screen.getByText("Jdog")).toBeInTheDocument();
  });
});
}); 


// This is a test for the update user button.
describe("Update", () => {

  it("should update a user when the update button is clicked", async () => {
    render(<UserList />);
    // Wait for users to be displayed
    await waitFor(() => {
      expect(screen.getByText("Leanne Graham")).toBeInTheDocument();
    });
    // Click the first update button
    const updateButtons = screen.getAllByText("Update");
    fireEvent.click(updateButtons[0]);
    // Wait for the updated user to be displayed
    await waitFor(() => {
      expect(screen.getByText("Leanne Graham!")).toBeInTheDocument();
    });
  });
});

