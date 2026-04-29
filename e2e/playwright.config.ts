import { defineConfig } from '@playwright/test'

import { baseConfig } from './test/playwright.base'

const isRemoteApi = process.env.VITE_API_BASE?.includes('api.realworld.show')

export default defineConfig({
  ...baseConfig,
  testDir: './test',
  use: {
    ...baseConfig.use,
    baseURL: process.env.BASE_URL,
  },
  webServer: [
    ...(!isRemoteApi
      ? [
          {
            command: `JWT_SECRET=${process.env.JWT_SECRET || 'test-secret'} make run`,
            url: 'http://localhost:3000/api/tags',
            cwd:
              process.env.BACKEND_PATH ||
              '../../nitro-prisma-zod-realworld-example-app',
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
          },
        ]
      : []),
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      cwd: '../frontend',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
