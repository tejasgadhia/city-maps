# Changelog

All notable changes to this project will be documented in this file.

This project follows a lightweight variant of [Keep a Changelog](https://keepachangelog.com/)
and [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.6.1] - 2026-02-04
### Added
- Inline "Search any city" flow for non-listed locations
- Export panel size/orientation selectors (always visible)
- Onboarding hint for first-time users
- Mobile-visible labels for map toolbar controls

### Changed
- PNG/SVG exports now respect preview pan/zoom framing
- Water toggle auto-refetches when enabled after generation
- SVG export no longer references an undefined road weight control

## [0.6.0] - 2026-02-04
### Added
- SVG export
- New poster sizes: 11×14" and 16×20"
- Boundary relation fallback and bounds merging
- Coastline rendering in water layer

### Changed
- Faster previews via caching, progressive rendering, and simplification
- Improved Overpass fallbacks for empty area queries

## [0.5.0]
### Added
- Step-based loading UI with progress indicators
- Grid overlay and snap-to-center controls
- Text size customization (city & subtitle)
- Collapsible region groups in city list
- New favicon and tagline

### Changed
- Code optimization and cleanup

## [0.4.0]
### Added
- Three-column layout redesign
- 200+ prepopulated cities
- 12 unique map themes
- Batch processing mode
- Theme comparison modal

## [0.3.0]
### Added
- Interactive pan/zoom controls
- Portrait/landscape orientation
- Water body rendering
