


import React, { FormEvent, useState } from 'react';
import Modal from './Modal';
import API, { setAuthToken } from '@/api/axios';
import Cookies from 'js-cookie';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Получить CSRF-cookie
      await API.get('/sanctum/csrf-cookie');

      // 2. Установить X-XSRF-TOKEN заголовок вручную
      const token = Cookies.get('XSRF-TOKEN');
      if (token) {
        API.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token);
      }

      // 3. Отправить вход
      const res = await API.post('/login', {
        email,
        password,
      });

      // 4. Сохранить токен (если Laravel API возвращает его)
      const accessToken = res.data?.token;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        setAuthToken(accessToken);
      }

      onClose();
    } catch (err: any) {
      setError('Неверный email или пароль');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-center">🔐 Вход</h2>

      <form className="space-y-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <label className="text-sm flex items-center space-x-2 mt-1">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <span>Показать пароль</span>
          </label>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Войти
        </button>
      </form>
    </Modal>
  );
};

export default LoginModal;
