import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
/**
 * See https://playwright.dev/docs/test-configuration.
 */
// @ts-ignore
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 4 : 2,
    reporter: [['html', { open: 'never' }]],
    outputDir: './reports/temp',
    use: {
        headless: false,
        screenshot: 'on',
        trace: 'on',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'galaxy',
            use: { ...devices['Galaxy S8'] },
        },
        {
            name: 'iphone',
            use: { ...devices['iPhone 12 Pro'] },
        }

    ],
    testIgnore: '*ignore',
    timeout: 30_000,
    //expect: {}
});
