import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['be-src/**/*.test.ts', 'fe-src/**/*.test.ts']
  }
});