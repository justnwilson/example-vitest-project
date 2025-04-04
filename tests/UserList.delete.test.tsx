import userService, { User } from "../src/services/user-service";
import UserList from "../src/components/UserList";

import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

// I typed this array -- probably not necessary but good to have in typescript
// Note that I did not end up needing to hoist this, I think because it is not overriding anything (unlike mockUserService),
// and because this actual value doesn't get used until mockUserService.getAll is actually called down in the main
// body of the test.
let mockUsers: User[] = [
  { id: 1, name: "Leanne Graham" },
];

console.log(">>> mockUsers:", mockUsers)

// This is still hoisted because it needs to exist before that user service is imported in UserList, which is right there
// caught and overridden by vi.mock below.
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
    console.log(">>> mockUsers =", mockUsers)
    return {
      request: Promise.resolve({ data: mockUsers }), // This resolves with mock data
      cancel: vi.fn(), // You can mock the cancel function, though it's not used in the test
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



// clears the mock before each test
beforeEach(() => {
  vi.clearAllMocks();
});

describe("UserList", () => {
  // This was actually deleting user 1, aka Leanne Graham, lol
  // console.log("This is the delete log:", userService.delete(1));

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
