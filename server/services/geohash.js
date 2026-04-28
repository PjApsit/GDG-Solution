/**
 * GeoHash Service — Geospatial queries using geofire-common
 * WHY (Q11): Firestore doesn't support native geo queries.
 * GeoHash allows efficient radius-based lookups.
 */

import { geohashForLocation, geohashQueryBounds, distanceBetween } from 'geofire-common';

/**
 * Generate a geohash for a lat/lng pair
 */
export const getGeohash = (lat, lng) => {
  return geohashForLocation([lat, lng]);
};

/**
 * Find documents within a radius using geohash bounds
 * @param {object} center - { latitude, longitude }
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Array} Query bounds for Firestore
 */
export const getQueryBounds = (center, radiusKm) => {
  return geohashQueryBounds([center.latitude, center.longitude], radiusKm * 1000);
};

/**
 * Check if a point is within radius of center
 */
export const isWithinRadius = (center, point, radiusKm) => {
  const dist = distanceBetween(
    [center.latitude, center.longitude],
    [point.latitude, point.longitude]
  );
  return dist <= radiusKm;
};

/**
 * Get distance between two points in km
 */
export const getDistance = (point1, point2) => {
  return distanceBetween(
    [point1.latitude, point1.longitude],
    [point2.latitude, point2.longitude]
  );
};

/**
 * Check for duplicate reports within 50m (Q22)
 */
export const isDuplicate = (newPoint, existingPoints) => {
  for (const point of existingPoints) {
    const distance = getDistance(newPoint, point);
    if (distance <= 0.05) { // 50 meters
      return { isDuplicate: true, existingId: point.id, distance: Math.round(distance * 1000) };
    }
  }
  return { isDuplicate: false };
};
