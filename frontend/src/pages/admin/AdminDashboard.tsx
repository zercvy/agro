import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ users: 0, plots: 0, admins: 0 });

  useEffect(() => {
    API.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Ошибка при получении статистики', err));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">📊 Админ-панель: аналитика</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <div className="text-lg">👥 Пользователи</div>
          <div className="text-2xl font-bold">{stats.users}</div>
          <Link to="/admin/users" className="text-blue-500 text-sm hover:underline">Подробнее</Link>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <div className="text-lg">🌾 Участки</div>
          <div className="text-2xl font-bold">{stats.plots}</div>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <div className="text-lg">🛡 Админы</div>
          <div className="text-2xl font-bold">{stats.admins}</div>
          <Link to="/admin/create" className="text-blue-500 text-sm hover:underline">Добавить</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
