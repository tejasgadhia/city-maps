const path = require('path');
const { test, expect } = require('@playwright/test');
const { setupMockApis } = require('../fixtures/network');

const APP_URL = `file://${path.resolve(__dirname, '..', '..', 'index.html')}`;

test('desktop viewport is usable and generation flow completes', async ({ page }) => {
  const counts = await setupMockApis(page);
  await page.goto(APP_URL);

  await expect(page.locator('#desktopBlocker')).not.toHaveClass(/active/);
  await expect(page.locator('#status')).toContainText('roads', { timeout: 15000 });
  await expect(page.locator('#download')).toBeEnabled();
  await expect(page.locator('#downloadSvg')).toBeEnabled();

  expect(counts.streets).toBeGreaterThan(0);
  expect(counts.bounds).toBeGreaterThan(0);
});

test('desktop blocker activates below minimum viewport', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1000, height: 650 } });
  const page = await context.newPage();
  await setupMockApis(page);
  await page.goto(APP_URL);

  await expect(page.locator('#desktopBlocker')).toHaveClass(/active/);
  await expect(page.locator('#desktopBlocker')).toHaveAttribute('aria-hidden', 'false');

  await context.close();
});

test('water toggle fetches after enabling water on existing map', async ({ page }) => {
  const counts = await setupMockApis(page);
  await page.goto(APP_URL);
  await expect(page.locator('#status')).toContainText('roads', { timeout: 15000 });

  await page.evaluate(() => {
    const water = document.getElementById('water');
    if (!water) return;
    water.checked = false;
    water.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.click('#generate');
  await expect(page.locator('#status')).toContainText('roads', { timeout: 15000 });

  await page.evaluate(() => {
    const water = document.getElementById('water');
    if (!water) return;
    water.checked = true;
    water.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await expect(page.locator('#status')).toContainText('water features', { timeout: 8000 });
  expect(counts.water).toBeGreaterThanOrEqual(1);
});

test('download path reports error when blob encoding fails', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function patchedToBlob(callback, type, quality) {
      if (type === 'image/png') {
        callback(null);
        return;
      }
      return original.call(this, callback, type, quality);
    };
  });

  await setupMockApis(page);
  await page.goto(APP_URL);
  await expect(page.locator('#status')).toContainText('roads', { timeout: 15000 });

  await page.click('#download');
  await expect(page.locator('#status')).toContainText('Export failed', { timeout: 5000 });
  await context.close();
});

test('keyboard focus trap and control labels are present', async ({ page }) => {
  await setupMockApis(page);
  await page.goto(APP_URL);
  await expect(page.locator('#status')).toContainText('roads', { timeout: 15000 });

  await expect(page.locator('#zoomOut')).toHaveAttribute('aria-label', 'Zoom out map');
  await expect(page.locator('#zoomIn')).toHaveAttribute('aria-label', 'Zoom in map');
  await expect(page.locator('#gridToggle')).toHaveAttribute('aria-label', 'Toggle alignment grid');
  await expect(page.locator('#snapToggle')).toHaveAttribute('aria-label', 'Toggle snap to center');

  await page.click('#batch');
  await expect(page.locator('#batchModal')).toHaveClass(/open/);

  const prepared = await page.evaluate(() => {
    const modal = document.getElementById('batchModal');
    const focusable = Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(node => !node.disabled && node.getClientRects().length > 0);
    if (!focusable.length) return false;
    focusable[0].setAttribute('data-first-focus', '1');
    focusable[focusable.length - 1].focus();
    return true;
  });

  expect(prepared).toBeTruthy();
  await page.keyboard.press('Tab');
  await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute('data-first-focus'))).toBe('1');

  await page.keyboard.press('Escape');
  await expect(page.locator('#batchModal')).not.toHaveClass(/open/);
});
