import React, { FormEvent, useState } from 'react'
import Modal from './Modal'
import API, { setAuthToken } from "@/api/axios";

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await API.post('/register', {
        name: email.split('@')[0], // Laravel требует name, можно временно взять из email
        email,
        password,
        password_confirmation: rePassword,
      })
      setEmailSent(true)
    } catch (err: any) {
      setError('Ошибка регистрации. Проверьте поля.')
      console.error(err.response?.data || err.message)
    }
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-center">📝 Регистрация</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
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
          🛡 Подтверждение email будет отправлено на почту
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Зарегистрироваться
        </button>

        {emailSent && (
          <div className="mt-6 text-sm text-green-700 bg-green-50 p-3 rounded text-center">
            📩 Проверьте почту и перейдите по ссылке для активации аккаунта.
          </div>
        )}
      </form>
    </Modal>
  )
}

export default RegisterModal
