import React, { useState } from 'react'

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май',
  'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const sampleTasks = {
  "Май": {
    sow: ['редис', 'салат', 'базилик'],
    harvest: ['лук-батун', 'шпинат'],
    work: ['прореживание', 'мульчирование', 'подкормка']
  },
  "Июнь": {
    sow: ['огурцы', 'укроп'],
    harvest: ['редис', 'салат'],
    work: ['полив', 'удаление сорняков']
  }
}

const CalendarWidget = ({ hideLink = false }) => {
  const now = new Date()
  const [monthIndex, setMonthIndex] = useState(now.getMonth())
  const monthName = MONTHS[monthIndex]
  const tasks = sampleTasks[monthName] || {}

  const changeMonth = (delta) => {
    setMonthIndex((prev) => (prev + delta + 12) % 12)
  }

  return (
    <section className="bg-white rounded-lg shadow p-6 my-6">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="text-gray-600 hover:text-green-600">◀</button>
        <h2 className="text-xl font-semibold">{monthName}</h2>
        <button onClick={() => changeMonth(1)} className="text-gray-600 hover:text-green-600">▶</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <h3 className="font-semibold mb-1">✅ Что сеять:</h3>
          <ul className="list-disc list-inside text-gray-700">
            {tasks.sow?.map((item, i) => <li key={i}>{item}</li>) || <li>Нет данных</li>}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-1">🌾 Что собирать:</h3>
          <ul className="list-disc list-inside text-gray-700">
            {tasks.harvest?.map((item, i) => <li key={i}>{item}</li>) || <li>Нет данных</li>}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-1">🛠 Работы:</h3>
          <ul className="list-disc list-inside text-gray-700">
            {tasks.work?.map((item, i) => <li key={i}>{item}</li>) || <li>Нет данных</li>}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <button className="text-green-700 underline hover:text-green-900">
          Открыть подробный календарь
        </button>
      </div>
    </section>
  )
}

export default CalendarWidget
