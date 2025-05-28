import express from 'express';
import axios from 'axios';
import SunCalc from 'suncalc';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 55.75;
    const lon = parseFloat(req.query.lon as string) || 37.62;

    // 🛰️ Запрос к open-meteo API с текущими, дневными и почасовыми данными
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,cloud_cover,wind_speed_10m,relative_humidity_2m` +
      `&daily=temperature_2m_min,temperature_2m_max,sunrise,sunset,precipitation_sum` +
      `&hourly=temperature_2m` +
      `&timezone=auto`
    );

    const data = weatherRes.data;

    // 📈 Получение температуры на выбранные часы
    const getHourlyTemps = (hourly: any): { hour: string; temperature: number }[] => {
      const targetHours = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
      return hourly.time
        .map((time: string, index: number) => {
          const hourStr = time.split('T')[1];
          if (targetHours.includes(hourStr)) {
            return {
              hour: hourStr,
              temperature: hourly.temperature_2m[index],
            };
          }
          return null;
        })
        .filter((entry: any) => entry !== null);
    };

    // 🧭 Расчёт азимута солнца
    const sun = SunCalc.getPosition(new Date(), lat, lon);
    const azimuthDeg = Math.round((sun.azimuth * 180) / Math.PI + 180); // в градусах от севера

    const timezone = data.timezone || 'unknown';

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
      timezone,
    };

    const hourlyData = getHourlyTemps(data.hourly);

    // ✅ Возвращаем всё в одном объекте — как ожидает фронт
    res.json({
      ...weather,
      hourlyData
    });

  } catch (error: any) {
    console.error('Ошибка при получении погоды:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Ошибка при получении данных погоды' });
  }
});

export default router;
