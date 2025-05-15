import React from 'react'
import Modal from './Modal'

const LoginModal = ({ isOpen, onClose }) => {
  const handleLogin = (e) => {
    e.preventDefault()
    // Здесь будет логика входа
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-center">🔐 Вход</h2>

      <form className="space-y-4" onSubmit={handleLogin}>
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" required />
        <input type="password" placeholder="Пароль" className="w-full border p-2 rounded" required />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Войти
        </button>
      </form>
    </Modal>
  )
}

export default LoginModal
