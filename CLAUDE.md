# MapToPoster (City Maps) - Project Guidelines

## Project Overview

MapToPoster is a browser-based map poster generator that transforms city boundaries and street networks into beautiful, print-ready artwork. Users can generate customizable city map posters with 12 artistic themes and export them as high-resolution PNGs.

**Live Demo**: https://tejasgadhia.github.io/city-maps/

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Canvas API**: Core rendering engine
- **External APIs**:
  - Overpass API (OpenStreetMap data)
  - Photon API (Geocoding)
- **Libraries**: JSZip (batch export via CDN)
- **Deployment**: GitHub Pages (zero backend)

## Architecture Principles

### Single-Page Application
- Three-column layout (Cities | Preview | Options)
- Pure client-side processing
- No build tools or transpilation needed

### Data Flow
```
City Selection → Geocode → Fetch OSM Data → Process → Render Canvas → Export PNG
```

### State Management
- Global variables track: `place`, `data`, `zoom`, `panX`, `panY`, `currentCity`
- Event-driven updates trigger re-renders

## Code Conventions

### JavaScript

**Naming**:
- `$()` shorthand for `document.getElementById()`
- Boolean flags: `isPanning`, `snapEnabled`, `showGrid`
- Calculation variables: `minLat`, `maxLat`, `minLon`, `maxLon`

**Event Handlers**:
```javascript
element.onclick = () => { /* handler */ }
element.oninput = () => { /* re-render */ }
```

**Key Functions**:
- `render(canvas, themeKey, isPreview, scaleOverride, sizeOverride)` - Main rendering
- `fetchWithRetry(url, options, retries)` - API calls with exponential backoff
- `fetchStreets(areaId, lat, lon, radius)` - OSM street data query
- `fetchWater(areaId, lat, lon, radius)` - OSM water bodies query

### Canvas Rendering

**Coordinate Projection**:
```javascript
const proj = (lat, lon) => [
  margin + ((lon - adj.minLon) / (adj.maxLon - adj.minLon)) * mapW,
  mapTop + ((adj.maxLat - lat) / (adj.maxLat - adj.minLat)) * mapH
]
```

**Road Hierarchy**:
- 5-level color system per theme (motorway → residential)
- Draw lower-priority roads first (layering effect)

**Text Rendering**:
- Character-by-character with custom letter spacing
- Centered alignment with manual positioning

### CSS

- **CSS Variables**: `--bg`, `--text`, `--accent` for UI theming
- **Two Themes**: Dark (default) and Classic
- **Responsive**: Single-column mobile fallback (1024px+ desktop-first)

## Cities Database (`cities.js`)

### Structure
```javascript
const CITIES = {
  "tokyo": {
    name: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lon: 139.6503,
    osm_id: 1543125  // OSM relation ID for accurate boundary
  }
}
```

### Adding New Cities

1. Find city on OpenStreetMap
2. Get relation ID from OSM (type=relation, admin_level=8 typically)
3. Add entry to `CITIES` object:
```javascript
"city-key": {
  name: "City Name",
  country: "Country",
  lat: latitude,
  lon: longitude,
  osm_id: relation_id
}
```
4. Add country to appropriate region in `REGIONS` object

## Themes System

### Theme Structure
```javascript
const THEMES = {
  themeName: {
    name: "Display Name",
    bg: "#background",
    text: "#textColor",
    water: "#waterColor",
    roads: ["#motorway", "#primary", "#secondary", "#tertiary", "#residential"]
  }
}
```

### Road Hierarchy Colors
- Index 0: Motorway/Trunk (highest priority)
- Index 1: Primary
- Index 2: Secondary
- Index 3: Tertiary
- Index 4: Residential/Unclassified (lowest priority)

### Adding New Themes

1. Choose 5 road colors (ensure contrast with background)
2. Add theme object to `THEMES` in `index.html`
3. Test rendering with different cities (various road densities)

## Development Workflow

### Local Development
```bash
# No build needed
open index.html

# Or serve locally
npx serve
```

### Testing
- Test with cities of different sizes (small town vs. megacity)
- Verify all 12 themes render correctly
- Check canvas export at different sizes
- Test with/without water data (some cities have no water)

## API Usage & Error Handling

### Overpass API

**Rate Limiting**:
- Respect 429 (Too Many Requests) responses
- Implement exponential backoff (2s, 4s, 6s delays)
- Use retry logic (max 3 attempts)

**Query Structure**:
```javascript
// Prefer area-based queries (faster, more accurate)
`[out:json];area(${areaId})->.a;(way["highway"](area.a););out geom;`

// Fallback to radius-based if no area ID
`[out:json];(way["highway"](around:${radius},${lat},${lon}););out geom;`
```

**Error Handling**:
- Try area-based query first
- Fall back to radius-based query
- Handle network timeouts gracefully
- Continue rendering even if water fetch fails (optional feature)

### Photon API (Geocoding)

Used only for custom city search - prepopulated cities use OSM IDs directly.

## Canvas Performance

### Optimization Techniques
- Use proper `lineJoin` and `lineCap` for smooth roads
- Batch road drawing by type (reduce context switches)
- Offscreen canvas for high-resolution export
- Minimal re-renders (only on user interaction)

### Export Sizes (300 DPI)
```javascript
const SIZES = {
  '5x7': { portrait: [1500, 2100], landscape: [2100, 1500] },
  '8x10': { portrait: [2400, 3000], landscape: [3000, 2400] }
}
```

## Interactive Features

### Pan & Zoom
- Click-and-drag to pan canvas
- Mousewheel to zoom in/out
- Snap-to-center when within 15px threshold
- Reset button to restore original view

### Grid Overlay
- Center crosshairs for alignment
- Toggleable via checkbox
- Persists during pan/zoom

## Best Practices

### DO

- Test with OSM relation IDs (more accurate than coordinates)
- Implement retry logic for all API calls
- Handle missing water data gracefully (not all cities have water)
- Use offscreen canvas for exports (avoid blocking UI)
- Preserve aspect ratio during rendering

### DON'T

- Hardcode API retry limits too high (respect Overpass server)
- Skip validation on user-uploaded city data
- Render at full resolution in preview (use scale 0.35x)
- Block UI during long operations (use loading states)

## Common Tasks

### Adding a New Export Size

1. Add to `SIZES` object:
```javascript
'24x36': { portrait: [7200, 10800], landscape: [10800, 7200] }
```

2. Add option to export modal

### Debugging Rendering Issues

1. Check browser console for API errors
2. Verify OSM data structure matches selectors
3. Test with different themes (may reveal contrast issues)
4. Ensure road hierarchy colors are distinct

### Handling New OSM Data Structures

If OSM changes their data format:
1. Check `fetchStreets()` and `fetchWater()` queries
2. Update CSS selectors in Overpass queries
3. Adjust parser in rendering pipeline

## File Organization

- `index.html` - Entire application (~2,070 lines)
- `cities.js` - City database (~240 lines)
- No build files, no dependencies

## Deployment

**GitHub Pages**:
- Push to `main` branch
- Automatic deployment via GitHub Actions
- No server configuration needed

## Questions?

- Check existing themes for color palette inspiration
- Review `render()` function for canvas techniques
- See `fetchWithRetry()` for API error handling examples
- Consult OpenStreetMap wiki for OSM data structure

Keep it simple, vanilla, and client-side!
