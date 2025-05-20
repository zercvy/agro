import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

const Header: React.FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false)
  const [showRegister, setShowRegister] = useState<boolean>(false)

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-600">🌱 Агроассистент</Link>
          <nav className="space-x-4 flex items-center">
            <Link to="/" className="text-gray-600 hover:text-green-600">Главная</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-green-600">Кабинет</Link>

            <button
              onClick={() => setShowLogin(true)}
              className="text-gray-600 hover:text-green-600"
            >
              Войти
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Регистрация
            </button>
          </nav>
        </div>
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </>
  )
}

export default Header
