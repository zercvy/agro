import express from 'express';
import axios from 'axios';
import SunCalc from 'suncalc';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 55.75;
    const lon = parseFloat(req.query.lon as string) || 37.62;

    // 🔗 Запрос в Open-Meteo
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,cloud_cover,wind_speed_10m,relative_humidity_2m` +
      `&daily=temperature_2m_min,temperature_2m_max,relative_humidity_2m_mean,wind_speed_10m_max,sunrise,sunset,precipitation_sum` +
      `&hourly=temperature_2m,relative_humidity_2m` +
      `&timezone=auto`
    );

    const data = weatherRes.data;

    // 📈 Подготовка почасовых данных
    const getHourlyData = (hourly: any): { hour: string; temperature: number; humidity: number }[] => {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      return hourly.time
        .map((timeStr: string, index: number) => {
          const [datePart, hourPart] = timeStr.split('T');
          if (datePart === today || (datePart === tomorrowStr && hourPart === '00:00')) {
            return {
              hour: hourPart,
              temperature: data.hourly.temperature_2m[index],
              humidity: data.hourly.relative_humidity_2m[index],
            };
          }
          return null;
        })
        .filter((entry: any) => entry !== null);
    };

    // 🧭 Азимут солнца
    const sun = SunCalc.getPosition(new Date(), lat, lon);
    const azimuthDeg = Math.round((sun.azimuth * 180) / Math.PI + 180);

    // 📅 Прогноз на 7 дней
    const getWeekday = (dateStr: string): string => {
      return new Date(dateStr).toLocaleDateString('ru-RU', { weekday: 'short' });
    };

    const dailyForecast = data.daily.time.map((dateStr: string, index: number) => ({
      date: dateStr,
      weekday: getWeekday(dateStr),
      minTemp: data.daily.temperature_2m_min[index],
      maxTemp: data.daily.temperature_2m_max[index],
      humidity: data.daily.relative_humidity_2m_mean[index],
      wind: data.daily.wind_speed_10m_max[index],
    }));

    // 🌤 Текущая и завтрашняя погода
    const weather = {
      temperature: data.current.temperature_2m,
      wind: data.current.wind_speed_10m,
      humidity: data.current.relative_humidity_2m,
      clouds: data.current.cloud_cover,
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
      minTempTomorrow: data.daily.temperature_2m_min[1],
      maxTempTomorrow: data.daily.temperature_2m_max[1],
      precipitationTomorrow: data.daily.precipitation_sum[1],
      azimuth: azimuthDeg,
      latitude: lat,
      longitude: lon,
      timezone: data.timezone,
    };

    const hourlyData = getHourlyData(data.hourly);

    // ✅ Отправка на фронт
    res.json({
      ...weather,
      hourlyData,
      dailyForecast,
    });

  } catch (error: any) {
    console.error('Ошибка при получении погоды:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Ошибка при получении данных погоды' });
  }
});

export default router;
