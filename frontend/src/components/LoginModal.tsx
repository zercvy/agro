import React, { useState, FormEvent, useEffect } from 'react';
import Modal from './Modal';
import API from '../api/axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    API.get('/csrf-token').then(res => {
      setCsrfToken(res.data.csrfToken);
    });
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await API.post(
        '/login',
        { email, password },
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      onClose();
      window.location.reload(); // или useNavigate
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-center">🔐 Вход</h2>

      <form className="space-y-4" onSubmit={handleLogin}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border p-2 rounded" placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border p-2 rounded" placeholder="Пароль" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Войти</button>
      </form>
    </Modal>
  );
};

export default LoginModal;
