// components/AdminList.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface Admin {
  id: number;
  email: string;
  created_at: string;
}

interface AdminListProps {
  admins: Admin[];
}

const AdminList: React.FC<AdminListProps> = ({ admins }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-8">👨‍💻 Администраторы системы</h2>
      <div className="bg-white shadow rounded p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">#</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Дата регистрации</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, i) => (
              <tr key={admin.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{i + 1}</td>
                <td className="py-2">
                  <Link to={`/admin/admins/${admin.id}`} className="text-blue-600 hover:underline">
                    {admin.email}
                  </Link>
                </td>
                <td className="py-2">{new Date(admin.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminList;
