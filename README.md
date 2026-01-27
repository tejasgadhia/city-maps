# MapToPoster

Beautiful city map posters in seconds. A browser-based generator for print-ready map art.

**Live Demo:** https://tejasgadhia.github.io/city-maps/

## Features

### 🏙️ City Browser
- **200+ prepopulated cities** with accurate OSM boundary data
- **Collapsible regions** — North America, Europe, Asia, and more
- **Smart search** — Filter by city name or country
- **Multiple sort options** — By region, A→Z, or Z→A

### 🎨 Map Generation
- **12 unique themes** — From classic Noir to fantasy Parchment
- **Smart city boundaries** — Uses actual city limits via OpenStreetMap relations
- **Water bodies** — Rivers, lakes, and canals rendered beautifully
- **Interactive preview** — Pan, zoom, and center your map perfectly

### 🖼️ Canvas Controls
- **Grid overlay** — Alignment guides for perfect centering
- **Snap-to-center** — Auto-snap when dragging near center
- **Zoom controls** — Fine-tune your view (50%-200%)
- **Reset view** — One-click return to default position

### ✏️ Text Customization
- **Custom city/subtitle text** — Override auto-detected names
- **Adjustable font sizes** — City name (24-96px), subtitle (10-36px)
- **3 font styles** — Clean Sans, Classic Serif, Typewriter
- **Toggle coordinates** — Show/hide lat/lon display

### 📤 Export Options
- **Print-ready PNG** — 300 DPI output
- **Two sizes** — 5×7" (1500×2100px) or 8×10" (2400×3000px)
- **Portrait & landscape** — Choose orientation
- **Batch mode** — Generate multiple cities, download as ZIP
- **Theme compare** — Preview all 12 themes side-by-side

### 🎯 UI/UX
- **Dark & Classic themes** — Choose your preferred interface style
- **Step-based loading** — Clear progress with 4 numbered steps
- **Real-time stats** — See road/water counts as they load
- **Elapsed time** — Know how long generation takes

## Themes

| Theme | Style |
|-------|-------|
| **Noir** | Classic dark, white roads |
| **Ancient Parchment** | Fantasy/Lord of the Rings style |
| **Hologram** | Sci-fi cyan glow |
| **Neon City** | Cyberpunk pink & cyan |
| **Comic Pop** | Bold cartoon colors |
| **Candy** | Bright pastels |
| **Midnight Blue** | Deep navy with gold |
| **Blueprint** | Technical drafting |
| **Vintage Sepia** | Old photograph |
| **Enchanted Forest** | Deep woodland greens |
| **Sunset** | Warm golden hour |
| **Frozen** | Arctic whites & blues |

## Quick Start

1. **Select a city** from the left sidebar
2. **Customize** theme, size, and text options
3. **Generate Preview** to see your map
4. **Download PNG** for printing

## Batch Mode

Generate posters for multiple cities at once:

1. Click the **Batch** button
2. Enter cities (one per line): `Paris, France`
3. Select theme and size
4. Click **Start Batch**
5. Download the ZIP with all posters

## Tech Stack

- **Vanilla JavaScript** — No frameworks, no build step
- **OpenStreetMap** — Street and boundary data via Overpass API
- **Photon API** — Geocoding for custom city search
- **GitHub Pages** — Static hosting

## Local Development

```bash
git clone https://github.com/tejasgadhia/city-maps.git
cd city-maps
open index.html
```

No build step required.

## File Structure

```
├── index.html    # Main app (HTML + CSS + JS)
├── cities.js     # 200+ city database with OSM IDs
└── README.md
```

## Changelog

### v0.5.0 (Current)
- Step-based loading UI with progress indicators
- Grid overlay and snap-to-center controls
- Text size customization (city & subtitle)
- Collapsible region groups in city list
- New favicon and tagline
- Code optimization and cleanup

### v0.4.0
- Three-column layout redesign
- 200+ prepopulated cities
- 12 unique map themes
- Batch processing mode
- Theme comparison modal

### v0.3.0
- Interactive pan/zoom controls
- Portrait/landscape orientation
- Water body rendering

## Credits

Inspired by [anvaka/city-roads](https://github.com/anvaka/city-roads) and [originalankur/maptoposter](https://github.com/originalankur/maptoposter).

Data © OpenStreetMap contributors.


## License

This project is licensed under the [O'Saasy License Agreement](https://osaasy.dev/).

**TL;DR**: You can use, modify, and distribute this project freely. You can self-host it for personal or commercial use. However, you cannot offer it as a competing hosted/managed SaaS product.

See [LICENSE.md](LICENSE.md) for full details.
