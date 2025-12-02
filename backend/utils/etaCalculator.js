const { getSeaRoute } = require('sea-route-finder');

/**
 * Calculate ETA based on REAL Sea Route Distance
 * Uses the 'sea-route-finder' library (v2.0)
 */
function calculateETA(currentLat, currentLng, destLat, destLng) {
  const start = { lat: currentLat, lng: currentLng };
  const end = { lat: destLat, lng: destLng };

  // 1. Get the Real Distance (in Km) from your library
  const routeData = getSeaRoute(start, end);
  const distanceKm = routeData.distance;

  // 2. Calculate Time
  const AVERAGE_SPEED_KMH = 40; // ~21.5 knots (Cargo Ship Speed)
  const hoursToDestination = distanceKm / AVERAGE_SPEED_KMH;

  const eta = new Date();
  eta.setHours(eta.getHours() + hoursToDestination);

  return {
    eta,
    distanceKm: Math.round(distanceKm),
    estimatedHours: Math.round(hoursToDestination * 10) / 10
  };
}

/**
 * Determine status based on distance to destination
 */
function determineStatus(currentLat, currentLng, route) {
  const dest = route[route.length - 1].coordinates;
  
  // Calculate straight-line distance to destination for status check
  // (We don't need the full sea path just to check if we are close)
  const R = 6371; 
  const dLat = (dest.lat - currentLat) * (Math.PI / 180);
  const dLng = (dest.lng - currentLng) * (Math.PI / 180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(currentLat * (Math.PI/180)) * Math.cos(dest.lat * (Math.PI/180)) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distToDest = R * c;

  if (distToDest < 20) return 'delivered';
  return 'in-transit';
}

module.exports = { calculateETA, determineStatus };