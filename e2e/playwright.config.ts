import { defineConfig } from '@playwright/test';
import { baseConfig } from './test/playwright.base';

export default defineConfig({
  ...baseConfig,
  testDir: './test',
  use: { 
    ...baseConfig.use, 
    baseURL: process.env.BASE_URL || 'http://localhost:5173' 
  },
});
