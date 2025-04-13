import { useState, useEffect } from 'react';
import Head from 'next/head';

const routeIcons = {
  'All': '🚌',
  'Historic': '🏛️',
  'Downtown': '🏙️',
  'Residential': '🏘️'
};

export default function Home() {
  // Hardcoded Savannah trolley data
  const savannahCoordinates = {
    'River Street Station': { lat: 32.0815, lng: -81.0902 },
    'Forsyth Park': { lat: 32.0718, lng: -81.0942 },
    'City Market': { lat: 32.0809, lng: -81.0923 },
    'Victorian District': { lat: 32.0679, lng: -81.0976 }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 1000); // Distance in meters
  };

  const getNextArrivalTime = (minutes) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const generateSchedule = (frequency, startHour, endHour) => {
    const schedule = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += frequency) {
        schedule.push(`${hour}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return schedule;
  };

  const savannahStops = [
    {
      id: 1,
      name: 'River Street Station',
      route: 'Historic',
      description: 'Main hub near Savannah River',
      lat: 32.0815,
      lng: -81.0902,
      nextArrival: getNextArrivalTime(8),
      schedule: generateSchedule(15, 7, 22),
      accessibility: {
        wheelchair: true,
        audioAnnouncements: true
      }
    },
    {
      id: 2,
      name: 'Forsyth Park Terminal',
      route: 'Downtown',
      description: 'Beautiful park with fountain',
      lat: 32.0718,
      lng: -81.0942,
      nextArrival: getNextArrivalTime(15),
      schedule: generateSchedule(20, 6, 23),
      accessibility: {
        wheelchair: true,
        audioAnnouncements: false
      }
    },
    {
      id: 3,
      name: 'City Market Depot',
      route: 'Historic',
      description: 'Shopping and dining district',
      lat: 32.0809,
      lng: -81.0923,
      nextArrival: getNextArrivalTime(22),
      schedule: generateSchedule(15, 8, 24),
      accessibility: {
        wheelchair: false,
        audioAnnouncements: true
      }
    },
    {
      id: 4,
      name: 'Victorian District Stop',
      route: 'Residential',
      description: 'Historic residential area',
      lat: 32.0679,
      lng: -81.0976,
      nextArrival: getNextArrivalTime(30),
      schedule: generateSchedule(30, 6, 21),
      accessibility: {
        wheelchair: false,
        audioAnnouncements: false
      }
    }
  ];

  const [selectedRoute, setSelectedRoute] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [expandedStop, setExpandedStop] = useState(null);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      message: 'Construction near City Market may cause delays',
      severity: 'warning',
      routes: ['Historic'],
      expires: new Date(Date.now() + 86400000) // 24 hours from now
    }
  ]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position?.coords) {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
        }
      },
      (error) => console.log('Location access:', error.message)
    );
  }, []);

  const fetchWeather = async (coords) => {
    try {
      const res = await fetch(`/api/weather?lat=${coords.lat}&lon=${coords.lng}`);
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      console.error('Weather fetch failed:', error);
    }
  };

  const filteredStops = selectedRoute === 'All' 
    ? savannahStops 
    : savannahStops.filter(stop => stop.route === selectedRoute);

  const sortedStops = userLocation 
    ? [...filteredStops].sort((a, b) => calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) - calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng))
    : filteredStops;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-4 border-purple-500 border-b-transparent rounded-full animate-spin animation-delay-200"></div>
        </div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Loading Trolley Data
        </h2>
        <p className="mt-2 text-gray-400">Preparing your transit experience</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Head>
        <title>Savannah Trolley Tracker</title>
      </Head>

      <main className="min-h-screen p-6 max-w-6xl mx-auto">
        {/* Futuristic header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Savannah Trolley
          </h1>
          <div className="flex justify-center items-center gap-4">
            <p className="text-lg opacity-80">
              Next-gen transit experience
            </p>
            <div className="text-sm bg-blue-900/30 px-3 py-1 rounded-full flex items-center gap-2">
              🕰️ {currentTime}
            </div>
          </div>
        </header>

        {/* Route selector */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {['All', 'Historic', 'Downtown', 'Residential'].map(route => (
            <button
              key={route}
              onClick={() => setSelectedRoute(route)}
              className={`button px-6 py-3 rounded-full ${selectedRoute === route 
                ? 'ring-2 ring-white/50' 
                : 'bg-gray-800/50 hover:bg-gray-700/50'}`}
            >
              <span className="text-xl mr-2">{routeIcons[route]}</span>
              {route}
            </button>
          ))}
        </div>

        {/* Trolley stops */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedStops.map(stop => (
            <div key={stop.id} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-3 rounded-full text-blue-400 text-2xl">
                  🚌
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl">{stop.name}</h3>
                    <span className="text-xs bg-blue-900/30 px-2 py-1 rounded">
                      ID: {stop.id}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Route Info</h4>
                      <p className="text-sm">
                        <span className="bg-blue-900/30 px-2 py-1 rounded mr-2">
                          {stop.route}
                        </span>
                        {userLocation && (
                          <span className="text-sm">
                            📍 {calculateDistance(userLocation.lat, userLocation.lng, stop.lat, stop.lng)}m
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Next Arrival</h4>
                      <p className="text-blue-400 font-mono">
                        🕰️ {stop.nextArrival}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Accessibility</h4>
                      <div className="flex gap-3">
                        {stop.accessibility.wheelchair && (
                          <span className="text-xs bg-green-900/30 px-2 py-1 rounded flex items-center gap-1">
                            ♿ Wheelchair
                          </span>
                        )}
                        {stop.accessibility.audioAnnouncements && (
                          <span className="text-xs bg-purple-900/30 px-2 py-1 rounded flex items-center gap-1">
                            🔊 Audio
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Coordinates</h4>
                      <p className="text-xs font-mono opacity-80">
                        {stop.lat.toFixed(6)}, {stop.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
