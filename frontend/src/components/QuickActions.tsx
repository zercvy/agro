// // components/QuickActions.tsx

// import { Component } from 'lucide-react'
// import React from 'react'
// import { Link } from 'react-router-dom'

// interface QuickActionsProps {
//   onRecommendOpen: () => void
// }

// const QuickActions: React.FC<QuickActionsProps> = ({ onRecommendOpen }) => {
//   return (
//     <div className="flex flex-wrap gap-4 mb-8">
//       <Link to="/create-plot" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//         ➕ Добавить участок
//       </Link>
//       <button
//         onClick={onRecommendOpen}
//         className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
//       >
//         🌿 Что посадить?
//       </button>
//       <Link to="/calendar" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//         📅 Календарь
//       </Link>
//       <Link to="/windowsills" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
//         🪟 Подоконники
//       </Link>
//       <Link to="/my-cultures" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
//         🌱 Мои культуры
//       </Link>
//       <Link to="/fertilizer" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
//         🧪 Удобрения
//       </Link>
//       <Link to="/analytics" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
//         📈 Аналитика
//       </Link>
//       <Link to="/plots" className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700">
//         🗂 Участки
//       </Link>
//     </div>
//   )
// }

// export default QuickActions


import React from 'react'
import { Link } from 'react-router-dom'

interface QuickActionsProps {
  onRecommendOpen: () => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ onRecommendOpen }) => {
  const link = (path: string, label: React.ReactNode, color: string) => (
    <Link
      to={{ pathname: path, state: { fromDashboard: true } }}
      className={`${color} text-white px-4 py-2 rounded hover:opacity-90`}
    >
      {label}
    </Link>
  );

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {link('/create-plot', '➕ Добавить участок', 'bg-green-600')}
      <button
        onClick={onRecommendOpen}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        🌿 Что посадить?
      </button>
      {link('/calendar', '📅 Календарь', 'bg-blue-600')}
      {link('/windowsills', '🪟 Подоконники', 'bg-purple-600')}
      {link('/my-cultures', '🌱 Мои культуры', 'bg-teal-600')}
      {link('/fertilizer', '🧪 Удобрения', 'bg-pink-600')}
      {link('/analytics', '📈 Аналитика', 'bg-indigo-600')}
      {link('/plots', '🗂 Участки', 'bg-lime-600')}
    </div>
  )
}

export default QuickActions
