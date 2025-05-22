import React from 'react'

const RecentActivity: React.FC = () => {
  return (
    <div className="mb-8 bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-2">🗂 Последние действия</h3>
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        <li>12 мая – Добавлен участок "Южная грядка"</li>
        <li>13 мая – Рекомендация: посадить базилик</li>
        <li>14 мая – Уведомление: ожидается понижение температуры</li>
      </ul>
    </div>
  )
}

export default RecentActivity
