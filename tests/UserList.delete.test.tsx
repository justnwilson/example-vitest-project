
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserList from "../src/components/UserList";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import React from "react";
import userService from "../src/services/user-service";

let mockUsers = [
  { id: 1, name: "Leanne Graham" },
];

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
}));

// clears the mock before each test
beforeEach(() => {
  vi.clearAllMocks(); // ✅ Clears previous mock calls before each test
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
  
    // Ensure userService.delete() was called
    //expect(userService.delete).toHaveBeenCalledWith(1);
  
    // Wait for user to be removed from UI
    await waitFor(() => {
      expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
    });
  });
/*   
beforeEach(() => {
  mockUsers = [
    { id: 1, name: "Leanne Graham" },
  ];
  vi.clearAllMocks();
  });
  function beforeEach(arg0: () => void) {
    throw new Error("Function not implemented.");
  }
});
 */

});