// import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
// import PlotCard from '../components/PlotCard'

// interface Plot {
//   id: number
//   name: string
//   soil: string
//   area: number
//   crops: string[]
// }

// const plots: Plot[] = [
//   {
//     id: 1,
//     name: 'Южная грядка',
//     soil: 'Суглинок',
//     area: 25,
//     crops: ['Томат', 'Базилик']
//   },
//   {
//     id: 2,
//     name: 'Теплица №1',
//     soil: 'Чернозём',
//     area: 40,
//     crops: ['Огурец', 'Салат']
//   }
// ]

// const PlotListPage: React.FC = () => {
//   return (
//     <>
//       <Header />
//       <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
//         <h2 className="text-2xl font-bold mb-4">🌿 Мои участки</h2>
//         {plots.map(plot => (
//           <PlotCard key={plot.id} plot={plot} />
//         ))}
//       </main>
//       <Footer />
//     </>
//   )
// }

// export default PlotListPage

import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import PlotCard from '../components/PlotCard';

interface Plot {
  id: number;
  name: string;
  soil_type: string;
  area: number;
  crops: string[]; // пока пустой массив или заглушка
}

const PlotListPage: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);

  useEffect(() => {
    API.get('/plots')
      .then((res) => setPlots(res.data.map((p: any) => ({
        ...p,
        crops: [], // временно
      }))))
      .catch((err) => {
        console.error('Ошибка загрузки участков:', err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">🌾 Мои участки</h2>
      {plots.length === 0 ? (
        <p className="text-gray-500">Участков пока нет. Создайте первый участок!</p>
      ) : (
        plots.map((plot) => (
          <PlotCard key={plot.id} plot={plot} />
        ))
      )}
    </div>
  );
};

export default PlotListPage;
