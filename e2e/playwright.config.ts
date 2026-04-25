import { defineConfig } from '@playwright/test'

import { baseConfig } from './test/playwright.base'

export default defineConfig({
  ...baseConfig,
  testDir: './test',
  use: {
    ...baseConfig.use,
    baseURL: process.env.BASE_URL,
  },
  webServer: [
    {
      command: `JWT_SECRET=${process.env.JWT_SECRET} bun run dev`,
      url: 'http://localhost:3000/api/tags',
      cwd: '/home/rinne/projects/my-package/my-realworld/nitro-prisma-zod-realworld-example-app',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      cwd: '../frontend',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
