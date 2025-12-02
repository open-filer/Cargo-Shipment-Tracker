const turf = require('@turf/turf');

exports.checkGeofence = (currentLocation, route) => {
  const alerts = [];
  
  // Check if deviated from route
  const routeLine = turf.lineString(
    route.map(r => [r.coordinates.lng, r.coordinates.lat])
  );
  const point = turf.point([currentLocation.lng, currentLocation.lat]);
  const distance = turf.pointToLineDistance(point, routeLine, { units: 'kilometers' });
  
  if (distance > 50) { // 50km threshold
    alerts.push({
      type: 'route_deviation',
      message: `Shipment is ${Math.round(distance)}km off route`,
      severity: 'high'
    });
  }
  
  return alerts;
};

exports.checkPortProximity = (currentLocation, ports) => {
  const alerts = [];
  
  ports.forEach(port => {
    const from = turf.point([currentLocation.lng, currentLocation.lat]);
    const to = turf.point([port.coordinates.lng, port.coordinates.lat]);
    const distance = turf.distance(from, to, { units: 'kilometers' });
    
    if (distance < 10) {
      alerts.push({
        type: 'port_proximity',
        message: `Approaching ${port.name} (${Math.round(distance)}km away)`,
        severity: 'info'
      });
    }
  });
  
  return alerts;
};
