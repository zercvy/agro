import React, { useState, FormEvent, useEffect } from 'react';
import API from '../../api/axios';

const CreateAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/admin/csrf-token')
      .then(res => setCsrfToken(res.data.csrfToken))
      .catch(() => setError('Не удалось получить CSRF токен'));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await API.post('/admin/create', { email, password }, {
        headers: { 'X-CSRF-Token': csrfToken }
      });
      setMessage('✅ Админ успешно создан');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || '❌ Ошибка при создании админа');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">➕ Создать администратора</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow w-full max-w-md">
        <input
          type="email"
          
          placeholder="Email администратора"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          ✅ Создать
        </button>

        {message && <p className="text-sm text-green-700">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default CreateAdmin;
