const path = require('path');
const { test, expect } = require('@playwright/test');
const { setupMockApis } = require('../fixtures/network');

const APP_URL = `file://${path.resolve(__dirname, '..', '..', 'index.html')}`;
const GENERATE_BUDGET_MS = 5000;
const HEAP_BUDGET_MB = 220;

test('performance budget: generation time and heap usage', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Heap metrics are only collected in Chromium via CDP');

  await setupMockApis(page);
  const client = await page.context().newCDPSession(page);
  await client.send('Performance.enable');

  const startedAt = Date.now();
  await page.goto(APP_URL);
  await expect(page.locator('#desktopBlocker')).not.toHaveClass(/active/);
  await expect(page.locator('#status')).toContainText('roads', { timeout: 15000 });
  const generationMs = Date.now() - startedAt;

  const metrics = await client.send('Performance.getMetrics');
  const heapBytes = metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value || 0;
  const heapMb = heapBytes / (1024 * 1024);

  expect(generationMs).toBeLessThanOrEqual(GENERATE_BUDGET_MS);
  expect(heapMb).toBeLessThanOrEqual(HEAP_BUDGET_MB);
});
