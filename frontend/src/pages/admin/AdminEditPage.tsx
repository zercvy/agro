import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';

const AdminEditPage: React.FC = () => {
  const { adminId } = useParams(); // Получаем ID администратора из URL
  const [admin, setAdmin] = useState<any>(null); // Информация о администраторе
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (adminId) {
      API.get(`/admin/admins/${adminId}`)
        .then((res) => {
          setAdmin(res.data);
          setEmail(res.data.email);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Ошибка загрузки данных администратора:', err);
        });
    }
  }, [adminId]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSaveEmail = async () => {
    try {
      await API.put(`/admin/admins/${adminId}/update-email`, { email });
      alert('Email администратора обновлен');
    } catch (err) {
      console.error('Ошибка при обновлении email', err);
    }
  };

  const handleSavePassword = async () => {
    try {
      await API.put(`/admin/admins/${adminId}/update-password`, { password: newPassword });
      alert('Пароль администратора обновлен');
    } catch (err) {
      console.error('Ошибка при обновлении пароля', err);
    }
  };

  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold">Информация о администраторе</h2>

      <div className="bg-white shadow rounded p-4 space-y-4">
        <div>
          <strong>Email:</strong>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="border p-2 rounded"
          />
          <button
            onClick={handleSaveEmail}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            Сохранить email
          </button>
        </div>

        <div>
          <strong>Новый пароль:</strong>
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={handleNewPasswordChange}
            className="border p-2 rounded"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={handleShowPasswordChange}
              className="mr-2"
            />
            Показать пароль
          </label>
        </div>

        <button
          onClick={handleSavePassword}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Сохранить пароль
        </button>
      </div>
    </div>
  );
};

export default AdminEditPage;
