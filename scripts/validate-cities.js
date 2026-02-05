#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const citiesPath = path.join(__dirname, '..', 'cities.js');
const source = fs.readFileSync(citiesPath, 'utf8');

const keyRegex = /"([^"]+)"\s*:\s*\{/g;
const keyCounts = new Map();
let match;
while ((match = keyRegex.exec(source)) !== null) {
  const key = match[1];
  keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
}

const duplicateKeys = Array.from(keyCounts.entries())
  .filter(([, count]) => count > 1)
  .map(([key, count]) => ({ key, count }));

let cityData;
try {
  cityData = require(citiesPath);
} catch (e) {
  console.error('Failed to require cities.js:', e.message);
  process.exit(1);
}

const cities = cityData.CITIES || {};
const issues = [];

for (const [key, city] of Object.entries(cities)) {
  if (!city || typeof city !== 'object') {
    issues.push(`Invalid entry for ${key}`);
    continue;
  }
  if (!city.name || !city.country) {
    issues.push(`Missing name/country for ${key}`);
  }
  if (!Number.isFinite(city.lat) || city.lat < -90 || city.lat > 90) {
    issues.push(`Invalid latitude for ${key}: ${city.lat}`);
  }
  if (!Number.isFinite(city.lon) || city.lon < -180 || city.lon > 180) {
    issues.push(`Invalid longitude for ${key}: ${city.lon}`);
  }
  if (!Number.isFinite(city.osm_id)) {
    issues.push(`Missing/invalid osm_id for ${key}: ${city.osm_id}`);
  }
}

if (duplicateKeys.length) {
  console.error('Duplicate keys detected:');
  duplicateKeys.forEach(({ key, count }) => {
    console.error(`- ${key} (x${count})`);
  });
}

if (issues.length) {
  console.error('\nData issues detected:');
  issues.forEach(issue => console.error(`- ${issue}`));
}

if (!duplicateKeys.length && !issues.length) {
  console.log(`OK: ${Object.keys(cities).length} cities validated`);
  process.exit(0);
}

process.exit(1);
