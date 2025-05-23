// import React from 'react'

// interface Pot {
//   culture: string
//   volume: number
//   status: string
// }

// const PotTable: React.FC = () => {
//   const pots: Pot[] = [
//     { culture: 'Томат', volume: 5, status: 'досветка' },
//     { culture: 'Укроп', volume: 2, status: 'растёт' },
//   ]

//   return (
//     <div className="bg-white p-6 mt-6 rounded shadow">
//       <h3 className="text-lg font-semibold mb-4">🧾 Горшки на подоконнике</h3>
//       <table className="w-full text-sm">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="p-2 text-left">Культура</th>
//             <th className="p-2 text-left">Объём (л)</th>
//             <th className="p-2 text-left">Статус</th>
//           </tr>
//         </thead>
//         <tbody>
//           {pots.map((pot, i) => (
//             <tr key={i} className="border-t">
//               <td className="p-2">{pot.culture}</td>
//               <td className="p-2">{pot.volume}</td>
//               <td className="p-2">{pot.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default PotTable

import React, { useEffect, useState } from 'react'
import axios from '../api/axios'

interface Pot {
  id: number
  culture: string
  volume: number
  // В будущем: status (например, "недостаточно света")
}

interface Props {
  windowsillId: number
}

const PotTable: React.FC<Props> = ({ windowsillId }) => {
  const [pots, setPots] = useState<Pot[]>([])

  useEffect(() => {
    const fetchPots = async () => {
      try {
        const res = await axios.get(`/pots?windowsillId=${windowsillId}`, {
          withCredentials: true,
        })
        setPots(res.data)
      } catch (err) {
        console.error('Ошибка при загрузке горшков:', err)
      }
    }

    if (windowsillId) fetchPots()
  }, [windowsillId])

  if (!windowsillId) return null

  return (
    <div className="bg-white p-6 mt-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">🧾 Горшки на подоконнике</h3>
      {pots.length === 0 ? (
        <p className="text-sm text-gray-500">Нет добавленных горшков</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Культура</th>
              <th className="p-2 text-left">Объём (л)</th>
            </tr>
          </thead>
          <tbody>
            {pots.map((pot) => (
              <tr key={pot.id} className="border-t">
                <td className="p-2">{pot.culture}</td>
                <td className="p-2">{pot.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default PotTable
