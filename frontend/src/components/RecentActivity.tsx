// import React from 'react'

// const RecentActivity: React.FC = () => {
//   return (
//     <div className="mb-8 bg-white shadow rounded p-4">
//       <h3 className="text-lg font-semibold mb-2">🗂 Последние действия</h3>
//       <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
//         <li>12 мая – Добавлен участок "Южная грядка"</li>
//         <li>13 мая – Рекомендация: посадить базилик</li>
//         <li>14 мая – Уведомление: ожидается понижение температуры</li>
//       </ul>
//     </div>
//   )
// }

// export default RecentActivity

import React, { useEffect, useState } from 'react'
import API from '../api/axios'

interface Item {
  name?: string
  createdAt: string
  side?: string
  floor?: number
}

interface ActivityData {
  cultures: Item[]
  windowsills: Item[]
  pots: Item[]
}

const RecentActivity: React.FC = () => {
  const [data, setData] = useState<ActivityData>({
    cultures: [],
    windowsills: [],
    pots: [],
  });

  useEffect(() => {
    API.get('/user/recent')
      .then(res => setData(res.data))
      .catch(err => console.error('Ошибка при загрузке активности', err));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' });

  return (
    <div className="mb-8 bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-2">🗂 Последние действия</h3>
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        {data.cultures.map((c, i) => (
          <li key={`culture-${i}`}>
            {formatDate(c.createdAt)} – Добавлена культура "{c.name}"
          </li>
        ))}
        {data.windowsills.map((w, i) => (
          <li key={`win-${i}`}>
            {formatDate(w.createdAt)} – Добавлен подоконник ({w.side}, {w.floor} эт.)
          </li>
        ))}
        {data.pots.map((p, i) => (
          <li key={`pot-${i}`}>
            {formatDate(p.createdAt)} – Добавлен горшок "{p.name}"
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
