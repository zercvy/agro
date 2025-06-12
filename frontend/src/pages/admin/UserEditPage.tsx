import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';

const UserEditPage: React.FC = () => {
  const { userId } = useParams(); // Получаем ID пользователя из URL
  const [user, setUser] = useState<any>(null); // Информация о пользователе
  const [loading, setLoading] = useState<boolean>(true);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (userId) {
      API.get(`/admin/users/${userId}`)
        .then((res) => {
          setUser(res.data);
          setName(res.data.name);
          setEmail(res.data.email);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Ошибка загрузки данных пользователя:', err);
        });
    }
  }, [userId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleSaveName = async () => {
    try {
      await API.put(`/admin/users/${userId}/update-name`, { name });
      alert('Имя пользователя обновлено');
    } catch (err) {
      console.error('Ошибка при обновлении имени', err);
    }
  };

  const handleSaveEmail = async () => {
    try {
      await API.put(`/admin/users/${userId}/update-email`, { email });
      alert('Email пользователя обновлен');
    } catch (err) {
      console.error('Ошибка при обновлении email', err);
    }
  };

  const handleSavePassword = async () => {
    try {
      await API.put(`/admin/users/${userId}/update-password`, { password: newPassword });
      alert('Пароль пользователя обновлен');
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
      <h2 className="text-2xl font-bold">Информация о пользователе</h2>

      <div className="bg-white shadow rounded p-4 space-y-4">
        <div>
          <strong>Имя:</strong>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="border p-2 rounded"
          />
          <button
            onClick={handleSaveName}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          >
            Сохранить имя
          </button>
        </div>

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

        <div>
          <strong>Дата регистрации:</strong> {new Date(user.created_at).toLocaleString()}
        </div>

        <div>
          <strong>Статистика:</strong>
          <ul>
            <li>Участков: {user.plots.length}</li>
            <li>Горшков: {user.pots.length}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserEditPage;
