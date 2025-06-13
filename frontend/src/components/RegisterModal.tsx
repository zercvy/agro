import React, { FormEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import API from '../api/axios';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAuth } from '../context/AuthContext';
import DOMPurify from 'dompurify';
import validator from 'validator';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { isAuthenticated, loading } = useAuth();

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

  if (loading || isAuthenticated) return null;

  const isValidPassword = (pwd: string) =>
    pwd.length >= 6 && /[a-zA-Zа-яА-Я]/.test(pwd) && /\d/.test(pwd);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = DOMPurify.sanitize(name.trim());
    const cleanEmail = validator.normalizeEmail(email.trim()) || '';
    const cleanPassword = DOMPurify.sanitize(password.trim());
    const cleanRePassword = DOMPurify.sanitize(rePassword.trim());

    if (!validator.isLength(cleanName, { min: 2 })) {
      setError('Имя должно содержать минимум 2 символа');
      return;
    }

    if (!validator.isEmail(cleanEmail)) {
      setError('Некорректный email');
      return;
    }

    if (!isValidPassword(cleanPassword)) {
      setError('Пароль должен быть не менее 6 символов и содержать хотя бы одну букву и одну цифру');
      return;
    }

    if (cleanPassword !== cleanRePassword) {
      setError('Пароли не совпадают');
      return;
    }

    let captchaToken = null;

    if (!isAuthenticated) {
      if (!executeRecaptcha) {
        setError('Капча не готова');
        return;
      }

      try {
        captchaToken = await executeRecaptcha('register');
      } catch (err) {
        setError('Ошибка выполнения капчи');
        return;
      }
    }

    try {
      await API.post(
        '/register',
        { name: cleanName, email: cleanEmail, password: cleanPassword, captchaToken },
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
      <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
          disabled={emailSent}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
          disabled={emailSent}
        />

        <input
          type={showPasswords ? 'text' : 'password'}
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
          disabled={emailSent}
        />

        <input
          type={showPasswords ? 'text' : 'password'}
          placeholder="Подтверждение пароля"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
          disabled={emailSent}
        />

        <label className="text-sm flex items-center space-x-2 mt-1">
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={() => setShowPasswords(!showPasswords)}
          />
          <span>Показать пароли</span>
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={emailSent}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Зарегистрироваться
        </button>

        {emailSent && (
          <div className="mt-6 text-sm text-green-700 bg-green-50 p-3 rounded text-center">
            Пожалуйста, проверьте свою почту и перейдите по ссылке, чтобы завершить регистрацию.
          </div>
        )}
      </form>
    </Modal>
  );
};

export default RegisterModal;
