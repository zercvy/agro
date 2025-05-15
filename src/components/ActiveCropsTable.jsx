import React from 'react'

const ActiveCropsTable = () => {
  return (
    <div className="bg-white shadow rounded p-4 mb-12">
      <h3 className="text-lg font-semibold mb-4">🪴 Активные культуры</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Культура</th>
            <th className="p-2">Участок</th>
            <th className="p-2">Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-2">Томат</td>
            <td className="p-2">Грядка №1</td>
            <td className="p-2 text-green-600">растёт</td>
          </tr>
          <tr className="border-t">
            <td className="p-2">Огурец</td>
            <td className="p-2">Подоконник</td>
            <td className="p-2 text-yellow-600">досветка</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ActiveCropsTable
