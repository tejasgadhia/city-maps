# Release Checklist

Use this checklist for UX/performance-impacting releases.

## Pre-merge
- [ ] Linked issue(s) and scope are current.
- [ ] Local smoke test complete:
  - [ ] Select city -> Generate preview
  - [ ] Toggle water and verify expected behavior
  - [ ] PNG and SVG export path verified
  - [ ] Batch mode happy path verified
- [ ] Accessibility sanity complete:
  - [ ] Keyboard navigation and modal focus traps verified
  - [ ] Icon/button labels verified
- [ ] Visual regression tests pass (`npm run test:visual`).
- [ ] Performance budget test passes (`npm run test:perf`).
- [ ] Full automated suite passes (`npm run test:ci`).

## Post-merge (`main`)
- [ ] CI workflow is green for merge commit.
- [ ] GitHub Pages deploy workflow is green.
- [ ] Live smoke check on `https://tejasgadhia.github.io/city-maps/`.
- [ ] Issue(s) and umbrella tracker are closed/updated.
