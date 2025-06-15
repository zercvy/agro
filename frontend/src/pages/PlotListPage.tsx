import Header from '../components/Header'
import Footer from '../components/Footer'
import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import PlotCard from '../components/PlotCard';
import Breadcrumbs from '../components/Breadcrumbs';
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
      <Breadcrumbs />
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
