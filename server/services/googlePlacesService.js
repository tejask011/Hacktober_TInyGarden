import axios from 'axios';
import { getRealTileImage } from './osmService.js';

/**
 * Fetch real Google Places nearby using official Google Places API
 */
export async function getGoogleNearbyPlaces(lat, lon, radiusMeters = 300, apiKey = '') {
  if (!apiKey) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=${radiusMeters}&type=park|tourist_attraction|point_of_interest|museum|place_of_worship|establishment&key=${apiKey}`;

    const response = await axios.get(url, { timeout: 8000 });
    const results = response.data?.results || [];

    if (results.length > 0) {
      const places = results.map((item, idx) => {
        const itemLat = item.geometry?.location?.lat;
        const itemLon = item.geometry?.location?.lng;
        const dist = calculateDistanceKm(lat, lon, itemLat, itemLon);
        const photoRef = item.photos?.[0]?.photo_reference;

        const photoUrl = photoRef 
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${apiKey}`
          : getRealTileImage(itemLat, itemLon, 17);

        return {
          id: `google_${item.place_id || idx}`,
          name: item.name,
          category: item.types?.[0]?.replace(/_/g, ' ') || 'Point of Interest',
          lat: itemLat,
          lon: itemLon,
          distanceKm: +dist.toFixed(2),
          rating: item.rating || null,
          vicinity: item.vicinity || '',
          photoUrl
        };
      });

      places.sort((a, b) => a.distanceKm - b.distanceKm);
      return places.slice(0, 6);
    }
  } catch (err) {
    console.warn('Google Places API call warning:', err.message);
  }

  return null;
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
