import { FiSun, FiCloudRain, FiCloud } from 'react-icons/fi';

export default function WeatherCard({ weather }) {
  if (!weather) return null;
  
  const getWeatherIcon = () => {
    const main = weather.weather[0].main.toLowerCase();
    switch(main) {
      case 'clear': return <FiSun className="text-yellow-400" size={24} />;
      case 'rain': return <FiCloudRain className="text-blue-400" size={24} />;
      default: return <FiCloud className="text-gray-400" size={24} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
      <div className="mr-3">
        {getWeatherIcon()}
      </div>
      <div>
        <h3 className="font-medium">{Math.round(weather.main.temp)}°F</h3>
        <p className="text-sm text-gray-500 capitalize">
          {weather.weather[0].description}
        </p>
      </div>
    </div>
  );
}
