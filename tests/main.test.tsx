
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // ✅ Import this to extend matchers
import UserList from "../src/components/UserList";


/* describe('group', () => {
    it('should return true', () => {
        expect(1).toBeTruthy();
    })
}) */


    
describe("UserList", () => {
    it("renders the user list", () => {
    render(<UserList users={[{ id: 1, name: "John Doe" }, { id: 2, name: "Jane Doe" }]} />);

    // Check if users are in the document
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
});