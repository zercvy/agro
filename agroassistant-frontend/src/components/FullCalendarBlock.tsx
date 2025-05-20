import React from 'react'

const FullCalendarBlock: React.FC = () => {
  return (
    <section className="bg-white rounded-lg shadow p-6 my-8">
      <h3 className="text-lg font-semibold mb-4">📆 Подробный календарь задач</h3>

      <ul className="space-y-2 text-sm text-gray-700">
        <li>📌 5 мая — Посев базилика (Грядка 1)</li>
        <li>🧪 8 мая — Подкормка (Участок "Южный склон")</li>
        <li>🌾 14 мая — Сбор салата (Подоконник "Кухня")</li>
        <li>🛠 20 мая — Прополка</li>
        <li>📦 28 мая — Внесение удобрения (NPK 10-10-10)</li>
      </ul>

      {/* Позже здесь можно подключить react-calendar, fullcalendar или таблицу */}
    </section>
  )
}

export default FullCalendarBlock
