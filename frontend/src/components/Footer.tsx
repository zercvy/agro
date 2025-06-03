
import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        <p>© 2025 Агроассистент</p>
        <nav className="space-x-4">
          <a href="#" className="hover:text-green-600">Политика</a>
          <a href="#" className="hover:text-green-600">Контакты</a>
          <a href="#" className="hover:text-green-600">Telegram</a>
        </nav>
        <div className="text-xs text-gray-400">
          Защищено reCAPTCHA —{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-600"
          >
            Политика конфиденциальности
          </a>{' '}
          и{' '}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-600"
          >
            Условия использования
          </a>
          .
        </div>
      </div>
    </footer>
  )
}

export default Footer
