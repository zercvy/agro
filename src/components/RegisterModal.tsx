import React, { useState, FormEvent } from 'react'
import Modal from './Modal'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEmailSent(true)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6 text-center">📝 Регистрация</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" placeholder="Имя" className="w-full border p-2 rounded" required />
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" required />
        <input type="password" placeholder="Пароль" className="w-full border p-2 rounded" required />
        <input type="password" placeholder="Подтверждение пароля" className="w-full border p-2 rounded" required />

        <div className="bg-gray-100 border rounded p-3 text-center text-sm text-gray-600">
          🛡 Здесь будет капча (reCAPTCHA или другая)
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Зарегистрироваться
        </button>

        {emailSent && (
          <div className="mt-6 space-y-2">
            <p className="text-sm text-gray-700">📩 Мы отправили код на почту.</p>
            <input type="text" placeholder="Введите код" className="w-full border p-2 rounded" />
            <button type="button" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Подтвердить почту
            </button>
          </div>
        )}
      </form>
    </Modal>
  )
}

export default RegisterModal
