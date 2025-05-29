import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';

interface RawHourlyData {
  hour: string;
  temperature: number;
}

interface InterpolatedPoint {
  time: string;
  temperature: number;
}

interface WeatherChartProps {
  data: RawHourlyData[];
}

const interpolate2Min = (data: RawHourlyData[]): InterpolatedPoint[] => {
  const result: InterpolatedPoint[] = [];

  for (let i = 0; i < data.length - 1; i++) {
    const start = data[i];
    const end = data[i + 1];

    const [h1, m1] = start.hour.split(':').map(Number);
    const [h2, m2] = end.hour.split(':').map(Number);

    const startMin = h1 * 60 + m1;
    const endMin = h2 * 60 + m2;
    const total = endMin - startMin;

    for (let t = 0; t <= total; t += 2) {
      const ratio = t / total;
      const temp = start.temperature + (end.temperature - start.temperature) * ratio;
      const minutes = startMin + t;
      const hourStr = String(Math.floor(minutes / 60)).padStart(2, '0');
      const minStr = String(minutes % 60).padStart(2, '0');

      result.push({
        time: `${hourStr}:${minStr}`,
        temperature: parseFloat(temp.toFixed(2)),
      });
    }
  }

  // ✅ Добавляем 24:00 как копию 23:00, если есть
  const last = data[data.length - 1];
  if (last?.hour === '23:00') {
    result.push({
      time: '24:00',
      temperature: last.temperature,
    });
  }

  // 🧩 Добавляем недостающие ключевые времена
  const mustHave = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
  const times = new Set(result.map(r => r.time));

  for (const time of mustHave) {
    if (!times.has(time)) {
      // Находим ближайшую по времени точку для вставки
      const match = result.find(r => r.time > time);
      const estimate = match ? match.temperature : 0;
      result.push({ time, temperature: parseFloat(estimate.toFixed(2)) });
    }
  }

  return result
    .filter(p => !(p.time === '24:00' && p.temperature === 0)) // 🧽 удаляем ошибочную 24:00 с 0°C
    .sort((a, b) => {
      const [ha, ma] = a.time.split(':').map(Number);
      const [hb, mb] = b.time.split(':').map(Number);
      return (ha * 60 + ma) - (hb * 60 + mb);
    });

};


const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => {
  const interpolated = interpolate2Min(data);
  const ticks = interpolated.map((point) => point.time);

  const now = new Date();
  const currentHour = String(now.getHours()).padStart(2, '0');
  const currentMinute = String(Math.floor(now.getMinutes() / 2) * 2).padStart(2, '0');
  const nowStr = `${currentHour}:${currentMinute}`;

  const verticalLines = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
    .filter((t) => ticks.includes(t));

  const fillZones = [
    { x1: '00:00', x2: '05:00' },
    { x1: '21:00', x2: '24:00' }
  ].filter(zone => ticks.includes(zone.x1) && ticks.includes(zone.x2));
  console.log("📍 VerticalLines", verticalLines);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={interpolated}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="time"
            type="category" // 💡 обязательная настройка!
            ticks={['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']}
            tickFormatter={(v) => v}
            minTickGap={0}
          />
          <YAxis unit="°C" />
          <Tooltip />

          {/* 🌙 Заливка ночных зон */}
          {fillZones.map(({ x1, x2 }) => (
            <ReferenceArea
              key={`${x1}-${x2}`}
              x1={x1}
              x2={x2}
              strokeOpacity={0}
              fill="#94a3b8"
              fillOpacity={0.3}
            />
          ))}

          {/* 📈 Температурная линия */}
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />

          {/* 🕓 Вертикальные линии каждые 4 часа */}
          {verticalLines.map((time) => (
            <ReferenceLine
              key={time}
              x={time}
              stroke="red"
              strokeDasharray="4 2"
              strokeWidth={2}
            />
          ))}


          {/* ⏱ Линия текущего времени */}
          {ticks.includes(nowStr) && (
            <ReferenceLine
              x={nowStr}
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="6 2"
              label={{
                position: 'top',
                value: 'Сейчас',
                fill: '#f97316',
                fontSize: 12,
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeatherChart;
