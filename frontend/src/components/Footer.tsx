import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 flex justify-between">
        <p>© 2025 Агроассистент</p>
        <nav className="space-x-4">
          <a href="#" className="hover:text-green-600">Политика</a>
          <a href="#" className="hover:text-green-600">Контакты</a>
          <a href="#" className="hover:text-green-600">Telegram</a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
