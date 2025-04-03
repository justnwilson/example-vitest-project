import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Ensure globals like `expect` work automatically
    environment: 'jsdom', // Needed for React testing
  },
});
