# MapToPoster

Browser-based city map poster generator. Create beautiful, print-ready map posters entirely in your browser.

**Live:** https://tejasgadhia.github.io/city-maps/

![MapToPoster Screenshot](https://via.placeholder.com/800x500/0a0a0a/ffffff?text=MapToPoster)

## Features

### City Browser
- **200+ prepopulated cities** — Ready to generate instantly
- **Search & filter** — Find cities by name or filter by region
- **Sort options** — Alphabetical or by country

### Map Generation
- **12 unique themes** — Noir, Blueprint, Neon City, Ancient Parchment, and more
- **Smart boundaries** — Uses actual city limits via OpenStreetMap relations
- **Water bodies** — Rivers, lakes, and canals included
- **Pan & zoom** — Interactive preview with mouse controls

### Export Options
- **Print-ready output** — 300 DPI (5×7" or 8×10")
- **Portrait & landscape** — Choose orientation
- **Batch mode** — Generate multiple cities at once, download as ZIP
- **Theme compare** — Preview all themes side-by-side

## Themes

| Theme | Description |
|-------|-------------|
| Noir | Classic dark with white roads |
| Ancient Parchment | Fantasy/Lord of the Rings style |
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

## Quick Start

1. **Select a city** from the left sidebar (or search for one)
2. **Choose options** in the right panel (theme, size, orientation)
3. **Download** your poster as PNG

## Batch Mode

Generate posters for multiple cities at once:

1. Click **Batch** button
2. Enter cities (one per line): `Paris, France`
3. Select theme and size
4. Click **Start Batch**
5. Download the ZIP file with all posters

## Tech Stack

- **Pure vanilla JS** — No build step, no dependencies
- **OpenStreetMap** — City boundaries and street data via Overpass API
- **Photon API** — Geocoding for city search
- **GitHub Pages** — Static hosting

## Local Development

```bash
# Clone the repo
git clone https://github.com/tejasgadhia/city-maps.git
cd city-maps

# Open in browser
open index.html
```

No build step required. Just open `index.html`.

## File Structure

```
├── index.html    # Main app (HTML + CSS + JS)
├── cities.js     # 200+ prepopulated city data
└── README.md
```

## Credits

Inspired by [anvaka/city-roads](https://github.com/anvaka/city-roads) and [originalankur/maptoposter](https://github.com/originalankur/maptoposter).

Data © OpenStreetMap contributors.

## License

MIT
