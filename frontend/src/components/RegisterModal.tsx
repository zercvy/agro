import React, { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import API from '../api/axios';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    API.get('/csrf-token').then(res => {
      setCsrfToken(res.data.csrfToken);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== rePassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (!executeRecaptcha) {
      setError('Капча не готова');
      return;
    }
    const captchaToken = await executeRecaptcha('register');

    try {
      await API.post(
        '/register',
        { name, email, password, captchaToken },
        { headers: { 'X-CSRF-Token': csrfToken } }
      );

      setEmailSent(true);
      setName('');
      setEmail('');
      setPassword('');
      setRePassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-center">📝 Регистрация</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type={showPasswords ? 'text' : 'password'}
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type={showPasswords ? 'text' : 'password'}
          placeholder="Подтверждение пароля"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <label className="text-sm flex items-center space-x-2 mt-1">
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={() => setShowPasswords(!showPasswords)}
          />
          <span>Показать пароли</span>
        </label>

        <div className="bg-gray-100 border rounded p-3 text-center text-sm text-gray-600">
          🛡 Подтверждение email пока не реализовано — вход сразу после регистрации
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Зарегистрироваться
        </button>

        {emailSent && (
          <div className="mt-6 text-sm text-green-700 bg-green-50 p-3 rounded text-center">
            ✅ Регистрация успешна! Теперь войдите в аккаунт.
          </div>
        )}
      </form>
    </Modal>
  );
};

export default RegisterModal;
