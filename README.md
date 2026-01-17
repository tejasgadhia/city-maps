# MapToPoster

Browser-based city map poster generator. Runs entirely in your browser — no server needed.

**Live:** https://tejasgadhia.github.io/city-maps/

## Features

- **12 unique themes** — From fantasy maps to sci-fi holograms
- **Portrait & landscape** — Choose the orientation that fits your city
- **Smart boundaries** — Uses actual city limits when available
- **Water bodies** — Rivers, lakes, and canals
- **Print-ready** — 300 DPI output (5×7" or 8×10")

## Themes

| Theme | Style |
|-------|-------|
| Noir | Classic dark with white roads |
| Ancient Parchment | Lord of the Rings fantasy map |
| Hologram | Sci-fi cyan glow |
| Neon City | Cyberpunk with hot pink and cyan |
| Comic Pop | Bold cartoon colors |
| Candy | Bright pastels |
| Midnight Blue | Deep navy with gold accents |
| Blueprint | Technical drafting style |
| Vintage Sepia | Old photograph look |
| Enchanted Forest | Deep woodland greens |
| Sunset | Warm golden hour tones |
| Frozen | Arctic whites and blues |

## Usage

1. Type a city name and select from results
2. Pick a theme and orientation
3. Click Generate Preview
4. Download the full-resolution PNG

## Tech

- **Nominatim** — City search and geocoding
- **Overpass API** — Street and water data from OpenStreetMap
- Pure vanilla JS, no dependencies

## Local Dev

Open `index.html` in a browser. That's it.

## Credits

Inspired by [anvaka/city-roads](https://github.com/anvaka/city-roads) and [originalankur/maptoposter](https://github.com/originalankur/maptoposter).

Data © OpenStreetMap contributors.
