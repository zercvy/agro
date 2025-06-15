// import React from 'react'

// const ActiveCropsTable: React.FC = () => {
//   return (
//     <div className="bg-white shadow rounded p-4 mb-12">
//       <h3 className="text-lg font-semibold mb-4">🪴 Активные культуры</h3>
//       <table className="w-full text-sm">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-2">Культура</th>
//             <th className="p-2">Участок</th>
//             <th className="p-2">Статус</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr className="border-t">
//             <td className="p-2">Томат</td>
//             <td className="p-2">Грядка №1</td>
//             <td className="p-2 text-green-600">растёт</td>
//           </tr>
//           <tr className="border-t">
//             <td className="p-2">Огурец</td>
//             <td className="p-2">Подоконник</td>
//             <td className="p-2 text-yellow-600">досветка</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default ActiveCropsTable

import React, { useEffect, useState } from 'react'
import API from '../api/axios'

interface Crop {
  culture: string
  location: string
  status: string
}

const ActiveCropsTable: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);

  useEffect(() => {
    API.get('/user/active-crops')
      .then(res => setCrops(res.data))
      .catch(err => console.error('Ошибка при загрузке активных культур', err));
  }, []);

  return (
    <div className="bg-white shadow rounded p-4 mb-12">
      <h3 className="text-lg font-semibold mb-4">🪴 Активные культуры</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Культура</th>
            <th className="p-2">Объект</th>
            <th className="p-2">Статус</th>
          </tr>
        </thead>
        <tbody>
          {crops.map((crop, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{crop.culture}</td>
              <td className="p-2">{crop.location}</td>
              <td className="p-2 text-gray-700">{crop.status}</td>
            </tr>
          ))}
          {crops.length === 0 && (
            <tr>
              <td colSpan={3} className="p-2 text-gray-400 text-center">Нет активных культур</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveCropsTable;
