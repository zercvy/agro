// import React from 'react'
// import { Link } from 'react-router-dom'

// interface Plot {
//   id: number | string
//   name: string
//   soil: string
//   area: number
//   crops: string[]
// }

// interface Props {
//   plot: Plot
// }

// const PlotCard: React.FC<Props> = ({ plot }) => {
//   return (
//     <div className="bg-white shadow p-6 rounded border border-gray-100">
//       <h3 className="text-lg font-semibold mb-1">{plot.name}</h3>
//       <p className="text-sm text-gray-600 mb-2">
//         Почва: <strong>{plot.soil}</strong> • Площадь: <strong>{plot.area} м²</strong>
//       </p>
//       <p className="text-sm text-gray-700 mb-3">Культуры: {plot.crops.join(', ')}</p>
//       <div className="flex gap-3">
//         <Link to="/analytics" className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
//           📈 Аналитика
//         </Link>
//         <Link to="#" className="text-sm border border-gray-400 px-3 py-1 rounded hover:bg-gray-100">
//           ✏️ Редактировать
//         </Link>
//         <Link to={`/plots/${plot.id}`} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
//           🔍 Подробнее
//         </Link>
//       </div>
//     </div>
//   )
// }

// export default PlotCard
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

interface Plot {
  id: number | string;
  name: string;
  soil: string;
  area: number;
  crops: string[];
}

interface Props {
  plot: Plot;
}

const PlotCard: React.FC<Props> = ({ plot }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm('Удалить участок?')) return;

    try {
      const res = await API.get('/csrf-token');
      const token = res.data.csrfToken;

      await API.delete(`/plots/${plot.id}`, {
        headers: {
          'X-CSRF-Token': token,
        },
      });

      window.location.reload(); // или обнови стейт
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded border border-gray-100">
      <h3 className="text-lg font-semibold mb-1">{plot.name}</h3>
      <p className="text-sm text-gray-600 mb-2">
        Почва: <strong>{plot.soil}</strong> • Площадь: <strong>{plot.area} м²</strong>
      </p>
      <p className="text-sm text-gray-700 mb-3">Культуры: {plot.crops.join(', ')}</p>
      <div className="flex gap-3 flex-wrap">
        <Link to="/analytics" className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
          📈 Аналитика
        </Link>
        <Link to={`/plots/edit/${plot.id}`} className="text-sm border border-gray-400 px-3 py-1 rounded hover:bg-gray-100">
          ✏️ Редактировать
        </Link>
        <Link to={`/plots/${plot.id}`} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          🔍 Подробнее
        </Link>
        <button onClick={handleDelete} className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
          🗑 Удалить
        </button>
      </div>
    </div>
  );
};

export default PlotCard;
