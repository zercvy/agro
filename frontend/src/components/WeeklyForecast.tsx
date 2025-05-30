import { useState } from 'react';

interface DayForecast {
  date: string; // "2025-05-29"
  weekday: string; // "Пн", "Вт" и т.д.
  minTemp: number;
  maxTemp: number;
  humidity: number; // среднее за день
  wind: number; // среднее за день
}

interface Props {
  data: DayForecast[];
  onSelectDay: (dayIndex: number) => void;
  selectedDayIndex: number;
}

const WeeklyForecast: React.FC<Props> = ({ data, onSelectDay, selectedDayIndex }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
      {data.map((day, index) => (
        <div
          key={day.date}
          className={`p-4 rounded-xl border shadow cursor-pointer ${
            index === selectedDayIndex ? 'bg-blue-100 border-blue-500' : 'bg-white'
          }`}
          onClick={() => onSelectDay(index)}
        >
          <div className="text-sm text-gray-500">{day.weekday}</div>
          <div className="text-lg font-bold">{day.date.slice(8, 10)}. {day.date.slice(5, 7)}</div>
          <div className="mt-1 text-sm">
            🌡 <span className="text-red-600">▲ {day.maxTemp}°C</span> / <span className="text-blue-600">▼ {day.minTemp}°C</span>
          </div>
          <div className="text-sm mt-1">💧 {day.humidity}%</div>
          <div className="text-sm">🌬 {day.wind} м/с</div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyForecast;
