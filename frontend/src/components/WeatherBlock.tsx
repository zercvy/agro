import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherMapModal from './WeatherMapModal';

interface WeatherData {
  temperature: number;
  wind: number;
  humidity: number;
  clouds: number;
  sunrise: string;
  sunset: string;
  minTempTomorrow: number;
  maxTempTomorrow: number;
  precipitationTomorrow: number;
  latitude: number;
  longitude: number;
  location: string;
  azimuth: number;
  timezone: string;
}

const WeatherBlock: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ lat, lon });
        fetchWeather(lat, lon);
      },
      (err) => {
        setGeoError('Не удалось получить геолокацию.');
        setLoading(false);
      }
    );
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await axios.get('/api/weather', {
        params: { lat, lon },
        withCredentials: true
      });
      setWeather({ ...response.data, latitude: lat, longitude: lon });
    } catch (error) {
      console.error('Ошибка при загрузке погоды:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDaylight = (sunriseStr: string, sunsetStr: string) => {
    const sunrise = new Date(sunriseStr);
    const sunset = new Date(sunsetStr);
    const diffMs = sunset.getTime() - sunrise.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    return `${hours} ч ${minutes} мин`;
  };

  const getWarnings = (weather: WeatherData): string[] => {
    const warnings: string[] = [];

    if (weather.minTempTomorrow < 0) {
      warnings.push(`Заморозки: до ${Math.round(weather.minTempTomorrow)}°C`);
    }

    if (weather.maxTempTomorrow > 30) {
      warnings.push(`Сильная жара: до ${Math.round(weather.maxTempTomorrow)}°C`);
    }

    if (weather.humidity > 90) {
      warnings.push(`Повышенная влажность: ${weather.humidity}%`);
    }

    if (weather.wind > 10) {
      warnings.push(`Сильный ветер: ${weather.wind} м/с`);
    }

    if (weather.clouds > 90) {
      warnings.push(`Почти полная облачность: ${weather.clouds}%`);
    }

    if (weather.precipitationTomorrow > 10) {
      warnings.push(`Ожидаются обильные осадки: ${weather.precipitationTomorrow} мм`);
    }

    return warnings;
  };

  const warnings = weather ? getWarnings(weather) : [];

  return (
    <section className="bg-white rounded-lg shadow p-6 my-6">
      <h2 className="text-xl font-semibold mb-4">🌤 Погода в вашем регионе</h2>

      {loading ? (
        <p>Загрузка погоды...</p>
      ) : geoError ? (
        <p className="text-red-600">{geoError}</p>
      ) : weather ? (
        <>
          <div
            className="flex justify-end text-sm text-gray-500 mb-2 cursor-pointer hover:underline"
            onClick={() => setIsMapOpen(true)}
          >
            🕓 {weather.timezone} — 📍 {weather.latitude.toFixed(4)}, {weather.longitude.toFixed(4)}
          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>🌡 Температура: <strong>{Math.round(weather.temperature)}°C</strong></div>
            <div>🌬 Ветер: <strong>{weather.wind} м/с</strong></div>
            <div>☁ Облачность: <strong>{weather.clouds}%</strong></div>
            <div>☀ Световой день: <strong>{formatDaylight(weather.sunrise, weather.sunset)}</strong></div>
            <div>💧 Влажность: <strong>{weather.humidity}%</strong></div>
            <div>🧭 Азимут солнца: <strong>{weather.azimuth}°</strong></div>
          </div>

          {warnings.length > 0 ? (
            <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
              <p className="font-semibold mb-2">⚠️ Внимание! Возможны неблагоприятные условия:</p>
              <ul className="list-disc pl-5 space-y-1">
                {warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-green-600">✅ Погодных угроз для растений не выявлено.</p>
          )}

          <button className="mt-3 text-green-600 underline">Подробнее о погоде</button>

          <WeatherMapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            lat={weather.latitude}
            lon={weather.longitude}
            onSelect={(lat, lon) => {
              setIsMapOpen(false);
              setCoords({ lat, lon });
              fetchWeather(lat, lon);
            }}
          />
        </>
      ) : (
        <p className="text-red-600">Ошибка при получении данных погоды.</p>
      )}
    </section>
  );
};

export default WeatherBlock;
