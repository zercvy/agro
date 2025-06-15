// import React from 'react'

// const DashboardStats: React.FC = () => {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//       <div className="bg-white p-4 shadow rounded text-center">
//         <p className="text-sm text-gray-500">Участков</p>
//         <p className="text-xl font-bold text-green-600">3</p>
//       </div>
//       <div className="bg-white p-4 shadow rounded text-center">
//         <p className="text-sm text-gray-500">Горшков</p>
//         <p className="text-xl font-bold text-green-600">7</p>
//       </div>
//       <div className="bg-white p-4 shadow rounded text-center">
//         <p className="text-sm text-gray-500">Культур</p>
//         <p className="text-xl font-bold text-green-600">5</p>
//       </div>
//       <div className="bg-white p-4 shadow rounded text-center">
//         <p className="text-sm text-gray-500">Уведомлений</p>
//         <p className="text-xl font-bold text-red-500">2</p>
//       </div>
//     </div>
//   )
// }

// export default DashboardStats

import React, { useEffect, useState } from 'react'
import API from '../api/axios'

interface Stats {
  plots: number
  pots: number
  cultures: number
}

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ plots: 0, pots: 0, cultures: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/user/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Ошибка при получении статистики', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Участков" value={stats.plots} loading={loading} />
      <StatCard label="Горшков" value={stats.pots} loading={loading} />
      <StatCard label="Культур" value={stats.cultures} loading={loading} />
      <StatCard label="Уведомлений" value={0} color="text-red-500" />
    </div>
  );
};

const StatCard = ({
  label,
  value,
  color = 'text-green-600',
  loading = false,
}: {
  label: string
  value: number
  color?: string
  loading?: boolean
}) => (
  <div className="bg-white p-4 shadow rounded text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-xl font-bold ${color}`}>
      {loading ? '...' : value}
    </p>
  </div>
);

export default DashboardStats;
