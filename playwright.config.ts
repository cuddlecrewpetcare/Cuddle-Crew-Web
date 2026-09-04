import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  workers: process.env.CI ? 2 : 1,
  outputDir: '.cache/local-dev/playwright/test-results',
  reporter: [['line'],['html',{outputFolder:'.cache/local-dev/playwright/report',open:'never'}]],
  use: {baseURL: 'http://127.0.0.1:3100', screenshot: 'only-on-failure', trace: 'retain-on-failure', video: 'off'},
});
