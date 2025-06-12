import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherMapModal from './WeatherMapModal';
import WeatherChart from './WeatherChart';
import SunAzimuth from './SunAzimuth';
import WeatherHumidityChart from './WeatherHumidityChart';
import WeeklyForecast from './WeeklyForecast';

interface HourlyData {
  hour: string;
  temperature: number;
  humidity: number;
}

interface DayForecast {
  date: string;
  weekday: string;
  minTemp: number;
  maxTemp: number;
  humidity: number;
  wind: number;
  clouds?: number;
  sunrise?: string;
  sunset?: string;
  azimuth?: number;
  precipitation?: number;
}

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
  hourlyData: HourlyData[];
  dailyForecast: DayForecast[];
}

const WeatherBlock: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setCoords({ lat, lon });
        fetchWeather(lat, lon);
      },
      () => {
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

  const getWarnings = (weather: WeatherData | DayForecast): string[] => {
    const warnings: string[] = [];

    if ('minTempTomorrow' in weather && weather.minTempTomorrow < 0) {
      warnings.push(`Заморозки: до ${Math.round(weather.minTempTomorrow)}°C`);
    } else if ('minTemp' in weather && weather.minTemp < 0) {
      warnings.push(`Заморозки: до ${Math.round(weather.minTemp)}°C`);
    }

    if ('maxTempTomorrow' in weather && weather.maxTempTomorrow > 30) {
      warnings.push(`Сильная жара: до ${Math.round(weather.maxTempTomorrow)}°C`);
    } else if ('maxTemp' in weather && weather.maxTemp > 30) {
      warnings.push(`Сильная жара: до ${Math.round(weather.maxTemp)}°C`);
    }

    if (weather.humidity > 90) {
      warnings.push(`Повышенная влажность: ${weather.humidity}%`);
    }

    if (weather.wind > 10) {
      warnings.push(`Сильный ветер: ${weather.wind} м/с`);
    }

    if (typeof weather.clouds === 'number' && weather.clouds > 90) {
      warnings.push(`Почти полная облачность: ${weather.clouds}%`);
    }

    if ('precipitationTomorrow' in weather && weather.precipitationTomorrow > 10) {
      warnings.push(`Ожидаются обильные осадки: ${weather.precipitationTomorrow} мм`);
    } else if ('precipitation' in weather && typeof weather.precipitation === 'number' && weather.precipitation > 10) {
      warnings.push(`Ожидаются обильные осадки: ${weather.precipitation} мм`);
    }

    return warnings;
  };

  const activeDay = selectedDayIndex !== null ? weather?.dailyForecast?.[selectedDayIndex] : null;
  const warnings: string[] = weather ? getWarnings(activeDay || weather) : [];

  return (
    <section className="bg-white rounded-lg shadow p-6 my-6 relative">
      <h2 className="text-xl font-semibold mb-2">🌤 Погода в вашем регионе</h2>

      {weather && (
        <div
          className="absolute top-6 right-6 text-sm text-gray-500 cursor-pointer hover:underline"
          onClick={() => setIsMapOpen(true)}
        >
          🕓 {weather.timezone} — 📍 {weather.latitude.toFixed(4)}, {weather.longitude.toFixed(4)}
        </div>
      )}

      {loading ? (
        <p>Загрузка погоды...</p>
      ) : geoError ? (
        <p className="text-red-600">{geoError}</p>
      ) : weather ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-6">
            <div>🌡 Температура: <strong>{activeDay ? `${activeDay.maxTemp} / ${activeDay.minTemp} °C` : `${Math.round(weather.temperature)}°C`}</strong></div>
            <div>🌬 Ветер: <strong>{activeDay ? `${activeDay.wind} м/с` : `${weather.wind} м/с`}</strong></div>
            <div>☁ Облачность: <strong>{activeDay?.clouds !== undefined ? `${activeDay.clouds}%` : `${weather.clouds}%`}</strong></div>
            <div>☀ Световой день: <strong>{activeDay?.sunrise && activeDay?.sunset ? formatDaylight(activeDay.sunrise, activeDay.sunset) : formatDaylight(weather.sunrise, weather.sunset)}</strong></div>
            <div>💧 Влажность: <strong>{activeDay ? `${activeDay.humidity}%` : `${weather.humidity}%`}</strong></div>
            {!activeDay && (
              <div>🧭 Азимут солнца: <strong>{weather.azimuth}°</strong></div>
            )}
          </div>

          {warnings.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
              <p className="font-semibold mb-2">⚠️ Внимание! Возможны неблагоприятные условия:</p>
              <ul className="list-disc pl-5 space-y-1">
                {warnings.map((warning: string, idx: number) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 pt-4 border-t flex flex-wrap gap-4 justify-start text-sm text-gray-600">
            <button
              className="text-blue-600 underline"
              onClick={() => setShowForecast(!showForecast)}
            >
              {showForecast ? 'Скрыть прогноз' : 'Прогноз на неделю'}
            </button>
            <button
              className="text-green-600 underline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Скрыть подробности' : 'Подробнее о погоде'}
            </button>
          </div>

          {showForecast && weather.dailyForecast && (
            <WeeklyForecast
              data={weather.dailyForecast}
              selectedDayIndex={selectedDayIndex ?? -1}
              onSelectDay={(index) => {
                setSelectedDayIndex(index === selectedDayIndex ? null : index);
              }}
            />
          )}

          {isExpanded && weather.hourlyData && (
            <div className="mt-4 border-t pt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">📈 Температура</h3>
                <WeatherChart data={weather.hourlyData} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">💧 Влажность</h3>
                <WeatherHumidityChart data={weather.hourlyData} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">🧭 Сторона, где находится солнце</h3>
                <SunAzimuth azimuth={weather.azimuth} />
              </div>
            </div>
          )}

          <WeatherMapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            lat={weather.latitude}
            lon={weather.longitude}
            onSelect={(lat, lon) => {
              setIsMapOpen(false);
              setCoords({ lat, lon });
              fetchWeather(lat, lon);
              setSelectedDayIndex(null);
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
