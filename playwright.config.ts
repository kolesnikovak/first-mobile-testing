import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  workers: 1, // Run tests sequentially to avoid Appium session conflicts
  use: {
    screenshot: 'only-on-failure',
  },
});
