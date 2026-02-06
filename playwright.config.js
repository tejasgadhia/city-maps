const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  fullyParallel: true,
  timeout: 30000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      animations: 'disabled',
      scale: 'css',
      maxDiffPixelRatio: 0.03
    }
  },
  reporter: 'list',
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
    locale: 'en-US'
  }
});
