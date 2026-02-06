# Testing Guide

## Prerequisites
- Node.js 20+
- npm 10+

Install dependencies:

```bash
npm ci
```

Install Playwright browser (Chromium):

```bash
npx playwright install chromium
```

## Local Commands

Validate static city dataset:

```bash
node scripts/validate-cities.js
```

Run unit tests only:

```bash
npm run test:unit
```

Run browser e2e tests only:

```bash
npm run test:e2e
```

Run full suite (unit + e2e):

```bash
npm run test
```

## What the e2e Suite Covers
- Desktop blocker behavior at valid/invalid viewport sizes
- Initial city generation and enabled export controls
- Water toggle fetch behavior
- PNG export failure handling path
- Modal keyboard focus trap and control accessibility labels
- Batch ZIP generation flow (with mocked JSZip module)
- Shareable URL state restore flow

## Determinism Notes
- External APIs (Overpass and Photon) are intercepted in tests using fixtures in `tests/fixtures/network.js`.
- Batch ZIP e2e test intercepts the JSZip CDN import with a deterministic test module.
- Tests target `index.html` directly via `file://` URL.

## CI
GitHub Actions workflow: `.github/workflows/ci.yml`

CI runs on pushes and pull requests to `main` and executes:
1. `npm ci`
2. `node scripts/validate-cities.js`
3. `npx playwright install --with-deps chromium`
4. `npm run test`

## Troubleshooting
If Playwright e2e tests fail due to missing browser binaries, rerun:

```bash
npx playwright install --with-deps chromium
```
