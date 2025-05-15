import React from 'react'

const PotTable = () => {
  const pots = [
    { culture: 'Томат', volume: 5, status: 'досветка' },
    { culture: 'Укроп', volume: 2, status: 'растёт' }
  ]

  return (
    <div className="bg-white p-6 mt-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">🧾 Горшки на подоконнике</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Культура</th>
            <th className="p-2 text-left">Объём (л)</th>
            <th className="p-2 text-left">Статус</th>
          </tr>
        </thead>
        <tbody>
          {pots.map((pot, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{pot.culture}</td>
              <td className="p-2">{pot.volume}</td>
              <td className="p-2">{pot.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PotTable
