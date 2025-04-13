import axios from 'axios';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minute cache
const cache = {};

export default async function handler(req, res) {
  // Validate API key
  if (!process.env.WEATHER_API_KEY) {
    return res.status(500).json({ 
      error: 'Weather API key not configured',
      solution: 'Add WEATHER_API_KEY to .env.local and restart server'
    });
  }

  // Validate coordinates
  const { lat, lon } = req.query;
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  
  if (isNaN(latNum) || isNaN(lonNum)) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }

  // Check cache
  const cacheKey = `${latNum.toFixed(2)},${lonNum.toFixed(2)}`;
  if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return res.status(200).json(formatWeatherData(cache[cacheKey].data));
  }

  // Fetch from API
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latNum}&lon=${lonNum}` +
      `&appid=${process.env.WEATHER_API_KEY}&units=imperial`
    );
    
    // Cache response
    cache[cacheKey] = {
      data: response.data,
      timestamp: Date.now()
    };
    
    return res.status(200).json(formatWeatherData(response.data));
  } catch (error) {
    console.error('Weather API Error:', error.message);
    return res.status(500).json({ 
      error: 'Weather service unavailable',
      details: error.response?.data?.message || error.message
    });
  }
}

// Simplify API response
function formatWeatherData(data) {
  return {
    temperature: Math.round(data.main.temp),
    conditions: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed)
  };
}
