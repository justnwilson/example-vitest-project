/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enable global test functions like `expect`
    environment: "jsdom", // Use jsdom environment for testing
    include: ["tests/**/*.test.tsx"], // Ensure the test files are included
  },
});
