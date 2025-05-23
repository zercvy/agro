import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import PlotForm from '../components/PlotForm'; // доработанный PlotForm принимает начальные значения и режим

const EditPlotPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/plots/${id}`)
      .then(res => {
        const plot = res.data;

        setInitialData({
          name: plot.name,
          type: plot.type,
          soilType: plot.soil_type,
          coordinates: plot.coordinates ? JSON.parse(plot.coordinates) : null,
          area: plot.area,
          perimeter: plot.perimeter,
          lightBarrier: plot.lightBarrier ? JSON.parse(plot.lightBarrier) : { type: '', height: '', distance: '', width: '' },
          windBarrier: plot.windBarrier ? JSON.parse(plot.windBarrier) : { type: '', height: '', distance: '', width: '' }


        });

        setLoading(false);
      })
      .catch(() => {
        setError('Не удалось загрузить участок');
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (formData: any) => {
    try {
      const res = await API.get('/csrf-token');
      const csrfToken = res.data.csrfToken;

      await API.put(`/plots/${id}`, formData, {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });

      alert('Участок обновлён');
      navigate(`/plots/${id}`);
    } catch (err) {
      console.error(err);
      alert('Ошибка обновления участка');
    }
  };

  if (loading) return <div className="p-6">Загрузка...</div>;
  if (error) return <div className="text-red-600 p-6">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">✏️ Редактирование участка</h2>
      <PlotForm isEdit initialData={initialData} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditPlotPage;
