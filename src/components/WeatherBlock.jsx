import React from 'react';

const WeatherBlock = () => {
  return (
    <section className="bg-white rounded-lg shadow p-6 my-6">
      <h2 className="text-xl font-semibold mb-4">🌤 Погода в вашем регионе</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>🌡 Температура: <strong>+22°C</strong></div>
        <div>🌬 Ветер: <strong>4 м/с</strong></div>
        <div>☁ Облачность: <strong>35%</strong></div>
        <div>☀ Световой день: <strong>13 ч 45 мин</strong></div>
        <div>💧 Влажность: <strong>70%</strong></div>
        <div>🧭 Азимут солнца: <strong>120°</strong></div>
      </div>
      <p className="mt-4 text-yellow-600">⚠️ Завтра ожидаются заморозки.</p>
      <button className="mt-3 text-green-600 underline">Подробнее о погоде</button>
    </section>
  );
};

export default WeatherBlock;
