import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /*
   * Run tests in files in parallel
   */
  fullyParallel: true,
  /*
   * Fail on the first critical error, enough for CI
   */
  forbidOnly: !!process.env.CI,
  /*
   * Retries on CI to absorb tile-load flakes
   */
  retries: process.env.CI ? 2 : 0,
  /*
   * CI job timeout
   */
  timeout: 60_000,
  /*
   * Default reporter
   */
  reporter: [['html', { open: 'never' }], ['list']],
  /*
   * Use URL from env or fallback
   */
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8787',
    trace: 'retain-on-failure',
  },
  /*
   * Screenshot tolerance
   */
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  /*
   * Shared settings for all projects.
   */
  /* project: [
    {
    name: 'chromium-desktop',
    use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
    name: 'chromium-mobile',
    use: { ...devices['iPhone 14'] },
    },
  ], */
  /*
   * Configure tests for two viewports: Chromium desktop and mobile
   */
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['iPhone 14'] },
    },
  ],
  /*
   * webServer is used only for local runs; CI uses actual deployed preview URL
   */
  webServer: process.env.CI ? undefined : {
    command: 'npm run preview',
    url: 'http://localhost:8787',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
