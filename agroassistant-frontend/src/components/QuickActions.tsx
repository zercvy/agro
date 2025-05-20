import React from 'react'
import { Link } from 'react-router-dom'

interface QuickActionsProps {
  onRecommendOpen: () => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ onRecommendOpen }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <Link to="/create-plot" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        ➕ Добавить участок
      </Link>
      <button
        onClick={onRecommendOpen}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        🌿 Что посадить?
      </button>
      <Link to="/calendar" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        📅 Календарь
      </Link>
      <Link to="/windowsills" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
        🪟 Подоконники
      </Link>
      <Link to="/cultures" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
        🌱 Культуры
      </Link>
      <Link to="/fertilizer" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
        🧪 Удобрения
      </Link>
      <Link to="/analytics" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        📈 Аналитика
      </Link>
      <Link to="/plots" className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700">
        🗂 Участки
      </Link>
    </div>
  )
}

export default QuickActions
