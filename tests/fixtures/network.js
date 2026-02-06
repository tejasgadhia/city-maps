const OVERPASS_ENDPOINT_RE = /https:\/\/(overpass-api\.de|overpass\.kumi\.systems|overpass\.nchc\.org\.tw)\/api\/interpreter/;

function buildStreets() {
  return {
    elements: [
      {
        type: 'way',
        id: 1,
        tags: { highway: 'primary' },
        geometry: [
          { lat: 30.26, lon: -97.76 },
          { lat: 30.27, lon: -97.75 },
          { lat: 30.28, lon: -97.74 }
        ]
      },
      {
        type: 'way',
        id: 2,
        tags: { highway: 'residential' },
        geometry: [
          { lat: 30.25, lon: -97.74 },
          { lat: 30.26, lon: -97.73 },
          { lat: 30.27, lon: -97.72 }
        ]
      }
    ]
  };
}

function buildWater() {
  return {
    elements: [
      {
        type: 'way',
        id: 100,
        tags: { natural: 'water' },
        geometry: [
          { lat: 30.255, lon: -97.745 },
          { lat: 30.265, lon: -97.745 },
          { lat: 30.265, lon: -97.735 },
          { lat: 30.255, lon: -97.735 },
          { lat: 30.255, lon: -97.745 }
        ]
      }
    ]
  };
}

function buildBoundary() {
  return {
    elements: [
      {
        type: 'relation',
        id: 113314,
        tags: { admin_level: '8', name: 'Austin' }
      }
    ]
  };
}

function buildBounds() {
  return {
    elements: [
      {
        type: 'relation',
        id: 113314,
        bounds: { minlat: 30.1, minlon: -97.95, maxlat: 30.55, maxlon: -97.55 }
      }
    ]
  };
}

function buildPhoton() {
  return {
    features: [
      {
        geometry: { coordinates: [-97.7431, 30.2672] },
        properties: {
          name: 'Austin',
          city: 'Austin',
          country: 'United States',
          countrycode: 'US',
          osm_type: 'R',
          osm_id: 113314
        }
      }
    ]
  };
}

async function setupMockApis(page) {
  const counts = {
    overpass: 0,
    streets: 0,
    water: 0,
    boundary: 0,
    bounds: 0,
    photon: 0
  };

  await page.route(OVERPASS_ENDPOINT_RE, async route => {
    counts.overpass += 1;
    const body = route.request().postData() || '';

    if (body.includes('out bb')) {
      counts.bounds += 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildBounds())
      });
      return;
    }

    if (body.includes('out tags')) {
      counts.boundary += 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildBoundary())
      });
      return;
    }

    if (body.includes('"highway"')) {
      counts.streets += 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildStreets())
      });
      return;
    }

    if (body.includes('"natural"="water"') || body.includes('"waterway"')) {
      counts.water += 1;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildWater())
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ elements: [] })
    });
  });

  await page.route('https://photon.komoot.io/api/**', async route => {
    counts.photon += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildPhoton())
    });
  });

  return counts;
}

module.exports = { setupMockApis };
