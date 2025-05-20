import React, { FormEvent, useState } from 'react'
import Modal from './Modal'
import API, { setAuthToken } from '../api/axios'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await API.post('/auth/token/login/', { email, password })
      const token = res.data.auth_token
      localStorage.setItem('token', token)
      setAuthToken(token)
      onClose()
    } catch (err: any) {
      setError('Неверный email или пароль')
      console.error(err.response?.data || err.message)
    }
  }

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
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Войти
        </button>
      </form>
    </Modal>
  )
}

export default LoginModal
