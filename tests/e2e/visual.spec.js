const path = require('path');
const { test, expect } = require('@playwright/test');
const { setupMockApis } = require('../fixtures/network');

const APP_URL = `file://${path.resolve(__dirname, '..', '..', 'index.html')}`;

async function stabilizeUi(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        transition: none !important;
        animation: none !important;
      }
    `
  });
}

test('visual snapshot: landing view at 1440x900', async ({ page }) => {
  await setupMockApis(page);
  await page.goto(APP_URL);
  await stabilizeUi(page);
  await expect(page.locator('#desktopBlocker')).not.toHaveClass(/active/);
  await expect(page.locator('#status')).toContainText('roads', { timeout: 15000 });
  await expect(page).toHaveScreenshot('landing-1440x900.png', { fullPage: true });
});

test('visual snapshot: batch modal open at 1440x900', async ({ page }) => {
  await setupMockApis(page);
  await page.goto(APP_URL);
  await stabilizeUi(page);
  await expect(page.locator('#status')).toContainText('roads', { timeout: 15000 });
  await page.click('#batch');
  await expect(page.locator('#batchModal')).toHaveClass(/open/);
  await expect(page).toHaveScreenshot('batch-modal-1440x900.png', { fullPage: true });
});
