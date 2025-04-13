// Haversine distance calculation
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const safeParseCoord = (coord) => {
  const num = parseFloat(coord);
  return isNaN(num) ? 0 : num;
};

export default function handler(req, res) {
  const { lat, lon } = req.query;
  const latNum = safeParseCoord(lat);
  const lonNum = safeParseCoord(lon);

  const allStops = [
    { id: 1, name: 'Main Station', lat: 40.712, lng: -74.006, nextArrival: '5 min' },
    { id: 2, name: 'Central Square', lat: 40.715, lng: -74.008, nextArrival: '10 min' },
    { id: 3, name: 'West End', lat: 40.718, lng: -74.012, nextArrival: '15 min' }
  ];

  const stopsWithDistance = allStops.map(stop => ({
    ...stop,
    distance: calculateDistance(latNum, lonNum, stop.lat, stop.lng)
  })).sort((a, b) => a.distance - b.distance);

  res.status(200).json(stopsWithDistance);
}
