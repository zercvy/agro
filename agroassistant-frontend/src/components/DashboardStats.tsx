import React from 'react'

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 shadow rounded text-center">
        <p className="text-sm text-gray-500">Участков</p>
        <p className="text-xl font-bold text-green-600">3</p>
      </div>
      <div className="bg-white p-4 shadow rounded text-center">
        <p className="text-sm text-gray-500">Горшков</p>
        <p className="text-xl font-bold text-green-600">7</p>
      </div>
      <div className="bg-white p-4 shadow rounded text-center">
        <p className="text-sm text-gray-500">Культур</p>
        <p className="text-xl font-bold text-green-600">5</p>
      </div>
      <div className="bg-white p-4 shadow rounded text-center">
        <p className="text-sm text-gray-500">Уведомлений</p>
        <p className="text-xl font-bold text-red-500">2</p>
      </div>
    </div>
  )
}

export default DashboardStats
