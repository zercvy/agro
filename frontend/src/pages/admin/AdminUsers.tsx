import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import AdminUsersList from '../../components/admin/AdminUsersList';
import AdminList from '../../components/admin/AdminList';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]); // Состояние для пользователей
  const [admins, setAdmins] = useState<any[]>([]); // Состояние для администраторов

  useEffect(() => {
    API.get('/admin/users')  // Роут для получения пользователей
      .then(res => {
        setUsers(res.data.users); // Сохраняем пользователей
      })
      .catch(err => console.error('Ошибка при получении пользователей', err));

    API.get('/admin/admins')  // Роут для получения администраторов
      .then(res => {
        setAdmins(res.data.admins); // Сохраняем администраторов
      })
      .catch(err => console.error('Ошибка при получении администраторов', err));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <AdminUsersList users={users} />  {/* Компонент для пользователей */}
      <AdminList admins={admins} />     {/* Компонент для администраторов */}
    </div>
  );
};

export default AdminUsers;
