import express from 'express';
import axios from 'axios';
import SunCalc from 'suncalc';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 55.75;
    const lon = parseFloat(req.query.lon as string) || 37.62;

    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,cloud_cover,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_min,temperature_2m_max,sunrise,sunset,precipitation_sum&timezone=auto`
    );

    const data = weatherRes.data;

    // 🧭 Расчёт азимута
    const sun = SunCalc.getPosition(new Date(), lat, lon);
    const azimuthDeg = Math.round((sun.azimuth * 180) / Math.PI + 180); // Приведение к градусам от севера

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

    res.json(weather);
  } catch (error: any) {
    console.error('Ошибка при получении погоды:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Ошибка при получении данных погоды' });
  }
});

export default router;
