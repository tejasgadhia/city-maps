const path = require('path');
const { test, expect } = require('@playwright/test');
const { setupMockApis, setupMockJsZip } = require('../fixtures/network');

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

test('batch mode creates zip download with mocked JSZip', async ({ page }) => {
  await setupMockApis(page);
  const jszip = await setupMockJsZip(page);
  await page.addInitScript(() => {
    window.__lastDownloadName = '';
    window.__downloadCount = 0;
    HTMLAnchorElement.prototype.click = function patchedClick() {
      window.__downloadCount += 1;
      window.__lastDownloadName = this.download || '';
    };
  });

  await page.goto(APP_URL);
  await expect(page.locator('#status')).toContainText('roads', { timeout: 15000 });
  await page.click('#batch');
  await page.fill('#batchInput', 'Austin, United States\nSeattle, United States');
  await page.click('#batchStart');

  await expect(page.locator('#batchStatus')).toContainText('Done! 2/2 generated', { timeout: 25000 });
  expect(jszip.imports).toBeGreaterThanOrEqual(1);
  const downloadInfo = await page.evaluate(() => ({
    jszipImports: window.__jszipImportCount || 0,
    jszipGenerations: window.__jszipGenerateCount || 0,
    lastName: window.__lastDownloadName,
    count: window.__downloadCount
  }));

  expect(downloadInfo.jszipImports).toBeGreaterThanOrEqual(1);
  expect(downloadInfo.jszipGenerations).toBe(1);
  expect(downloadInfo.lastName).toBe('map-posters.zip');
  expect(downloadInfo.count).toBeGreaterThanOrEqual(1);
});

test('shareable URL state restores city and view settings', async ({ browser }) => {
  const contextA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageA = await contextA.newPage();
  await setupMockApis(pageA);
  await pageA.goto(APP_URL);
  await expect(pageA.locator('#status')).toContainText('roads', { timeout: 15000 });

  await pageA.selectOption('#theme', 'sunset');
  await pageA.fill('#customCity', 'Austin Reloaded');
  await pageA.click('#zoomIn');
  await pageA.click('#zoomIn');
  await pageA.waitForTimeout(500);
  await expect.poll(() => pageA.url()).toContain('s=');
  const sharedUrl = pageA.url();
  await contextA.close();

  const contextB = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageB = await contextB.newPage();
  await setupMockApis(pageB);
  await pageB.goto(sharedUrl);
  await expect(pageB.locator('#status')).toContainText('roads', { timeout: 15000 });
  await expect(pageB.locator('#theme')).toHaveValue('sunset');
  await expect(pageB.locator('#customCity')).toHaveValue('Austin Reloaded');
  await expect(pageB.locator('#zoomLevel')).not.toHaveText('100%');
  await contextB.close();
});

test('api debug mode displays reliability telemetry', async ({ page }) => {
  await setupMockApis(page);
  await page.goto(`${APP_URL}?debugApi=1`);
  await expect(page.locator('#status')).toContainText('roads', { timeout: 15000 });
  await expect(page.locator('body')).toHaveClass(/debug-api/);
  await expect(page.locator('#apiDebug')).toContainText('API Telemetry');
  await expect(page.locator('#apiDebug')).toContainText('overpass: req');
});
