import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    API.get('/admin/users')
      .then(res => setUsers(res.data.users))
      .catch(err => console.error('Ошибка при получении пользователей', err));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">👥 Пользователи системы</h2>
      <div className="bg-white shadow rounded p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">#</th>
              <th className="text-left py-2">Имя</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Дата регистрации</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{i + 1}</td>
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2">{new Date(user.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;