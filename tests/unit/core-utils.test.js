const test = require('node:test');
const assert = require('node:assert/strict');
const {
  runSharedRequest,
  estimateCacheEntryBytes,
  cacheKey,
  shouldAppendEndpoint,
  isDesktopViewportSize,
  canvasToPngBlob
} = require('../../scripts/core-utils.js');

test('runSharedRequest deduplicates concurrent work', async () => {
  const inflight = new Map();
  let calls = 0;
  const work = async () => {
    calls += 1;
    return 'ok';
  };

  const [a, b, c] = await Promise.all([
    runSharedRequest(inflight, 'k', work),
    runSharedRequest(inflight, 'k', work),
    runSharedRequest(inflight, 'k', work)
  ]);

  assert.equal(a, 'ok');
  assert.equal(b, 'ok');
  assert.equal(c, 'ok');
  assert.equal(calls, 1);
  assert.equal(inflight.size, 0);
});

test('estimateCacheEntryBytes returns positive number', () => {
  const bytes = estimateCacheEntryBytes({ name: 'Austin', values: [1, 2, 3] });
  assert.ok(bytes > 0);
});

test('cacheKey returns area and radius forms', () => {
  assert.equal(cacheKey(123, 0, 0, 0), 'a123');
  assert.equal(cacheKey(null, 30.2672, -97.7431, 10000), 'r30.2672:-97.7431:10000');
});

test('shouldAppendEndpoint detects movement threshold', () => {
  assert.equal(shouldAppendEndpoint(null, null, 1, 1), true);
  assert.equal(shouldAppendEndpoint(1, 1, 1, 1), false);
  assert.equal(shouldAppendEndpoint(1, 1, 1.01, 1), true);
});

test('isDesktopViewportSize checks thresholds', () => {
  assert.equal(isDesktopViewportSize(1440, 900, 1100, 700), true);
  assert.equal(isDesktopViewportSize(1000, 900, 1100, 700), false);
  assert.equal(isDesktopViewportSize(1440, 650, 1100, 700), false);
});

test('canvasToPngBlob resolves when blob exists', async () => {
  const fakeCanvas = {
    toBlob(cb) {
      cb({ size: 123 });
    }
  };

  const blob = await canvasToPngBlob(fakeCanvas);
  assert.equal(blob.size, 123);
});

test('canvasToPngBlob rejects when blob is null', async () => {
  const fakeCanvas = {
    toBlob(cb) {
      cb(null);
    }
  };

  await assert.rejects(() => canvasToPngBlob(fakeCanvas), /PNG export failed/);
});
