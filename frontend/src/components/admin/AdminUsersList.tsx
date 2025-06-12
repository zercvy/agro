// components/AdminUsersList.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface AdminUsersListProps {
  users: User[];
}

const AdminUsersList: React.FC<AdminUsersListProps> = ({ users }) => {
  return (
    <div>
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
                <td className="py-2">
                  <Link to={`/admin/users/${user.id}`} className="text-blue-600 hover:underline">
                    {user.name}
                  </Link>
                </td>
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

export default AdminUsersList;
