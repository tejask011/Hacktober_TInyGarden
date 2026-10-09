import axios from 'axios';

/**
 * Fetch walking routing geometry and distance from OSRM
 */
export async function getWalkingRoute(waypoints) {
  // waypoints: array of { lat, lon }
  if (!waypoints || waypoints.length < 2) {
    return null;
  }

  const coordString = waypoints.map(w => `${w.lon},${w.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/walking/${coordString}?overview=full&geometries=geojson&steps=true`;

  try {
    const response = await axios.get(url, { timeout: 6000 });
    const route = response.data?.routes?.[0];

    if (route) {
      const distanceKm = +(route.distance / 1000).toFixed(2);
      const durationMinutes = Math.round(route.duration / 60);
      const coordinates = route.geometry.coordinates.map(c => [c[1], c[0]]); // [lat, lon]
      
      const steps = (route.legs || []).flatMap(leg => 
        (leg.steps || []).map(step => ({
          instruction: step.maneuver?.type === 'depart' ? 'Start walk' : (step.name ? `Walk on ${step.name}` : step.maneuver?.instruction || 'Continue path'),
          distanceMeters: Math.round(step.distance)
        }))
      ).filter(s => s.distanceMeters > 5);

      return {
        coordinates,
        distanceKm,
        durationMinutes,
        steps: steps.slice(0, 8),
        source: 'OSRM Walking API'
      };
    }
  } catch (err) {
    console.warn('OSRM Walking route request fallback:', err.message);
  }

  // Fallback geometry generator
  return generateFallbackRoute(waypoints);
}

function generateFallbackRoute(waypoints) {
  const coordinates = [];
  let totalDistanceKm = 0;

  for (let i = 0; i < waypoints.length; i++) {
    const current = waypoints[i];
    coordinates.push([current.lat, current.lon]);

    if (i < waypoints.length - 1) {
      const next = waypoints[i + 1];
      // Insert intermediate path points for smoother map line
      const midLat = (current.lat + next.lat) / 2 + (Math.random() - 0.5) * 0.0005;
      const midLon = (current.lon + next.lon) / 2 + (Math.random() - 0.5) * 0.0005;
      coordinates.push([midLat, midLon]);
      
      totalDistanceKm += calculateDistance(current.lat, current.lon, next.lat, next.lon);
    }
  }

  // Average walking pace: ~4.8 km/h => ~12.5 mins per km
  const durationMinutes = Math.max(10, Math.round(totalDistanceKm * 12.5));

  const steps = waypoints.map((w, idx) => ({
    instruction: idx === 0 ? 'Start your walk at main waypoint' : `Head towards Stop ${idx}: ${w.name || 'Point of Interest'}`,
    distanceMeters: Math.round((totalDistanceKm / waypoints.length) * 1000)
  }));

  return {
    coordinates,
    distanceKm: +totalDistanceKm.toFixed(2),
    durationMinutes,
    steps,
    source: 'Estimated Geodesic Path'
  };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
