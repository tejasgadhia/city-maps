(function (globalScope) {
  'use strict';

  const EPSILON = 0.001;

  function runSharedRequest(inflightMap, key, work) {
    if (inflightMap.has(key)) return inflightMap.get(key);
    const task = Promise.resolve()
      .then(work)
      .finally(() => inflightMap.delete(key));
    inflightMap.set(key, task);
    return task;
  }

  function estimateCacheEntryBytes(value) {
    try {
      const raw = JSON.stringify(value);
      if (!raw) return 64;
      return Math.min(raw.length * 2, 8 * 1024 * 1024);
    } catch (e) {
      return 256;
    }
  }

  function cacheKey(areaId, lat, lon, radius) {
    if (areaId) return `a${areaId}`;
    return `r${Number(lat).toFixed(4)}:${Number(lon).toFixed(4)}:${radius}`;
  }

  function shouldAppendEndpoint(lastX, lastY, x, y) {
    if (lastX === null || lastY === null) return true;
    return Math.abs(x - lastX) > EPSILON || Math.abs(y - lastY) > EPSILON;
  }

  function isDesktopViewportSize(width, height, minWidth, minHeight) {
    return Number(width) >= Number(minWidth) && Number(height) >= Number(minHeight);
  }

  function canvasToPngBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('PNG export failed. Please retry.'));
          return;
        }
        resolve(blob);
      }, 'image/png');
    });
  }

  const api = {
    runSharedRequest,
    estimateCacheEntryBytes,
    cacheKey,
    shouldAppendEndpoint,
    isDesktopViewportSize,
    canvasToPngBlob
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  globalScope.MapToPosterCore = Object.assign({}, globalScope.MapToPosterCore || {}, api);
})(typeof window !== 'undefined' ? window : globalThis);
