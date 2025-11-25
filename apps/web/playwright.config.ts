import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 60_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] }
    }
  ]
});
