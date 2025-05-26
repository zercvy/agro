import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import PlotCropList from '../components/PlotCropList';
import PlotInfoBlock from '../components/PlotInfoBlock';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const PlotDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [plot, setPlot] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/plots/${id}`)
      .then((res) => setPlot(res.data))
      .catch(() => setError('Не удалось загрузить участок'));
  }, [id]);

  if (error) return <div className="text-red-600 p-6">{error}</div>;
  if (!plot) return <div className="p-6">Загрузка...</div>;

  const geoJson = plot.coordinates ? JSON.parse(plot.coordinates) : null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">{plot.name}</h2>

      <div className="h-[400px] w-full rounded border overflow-hidden">
        {geoJson ? (
          <MapContainer center={[55.75, 37.6]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON data={geoJson} />
          </MapContainer>
        ) : (
          <p className="text-gray-500">Границы не указаны</p>
        )}
      </div>

      <PlotInfoBlock
        plot={{
          area: plot.area,
          soil: plot.soil_type,
          lightBarriers: `${plot.lightBarrier?.type || '—'} / ${plot.lightBarrier?.height || '?'}м`,
          windBarriers: `${plot.windBarrier?.type || '—'} / ${plot.windBarrier?.height || '?'}м`,
        }}
      />

      <PlotCropList crops={plot.crops || []} />
    </div>
  );
};

export default PlotDetailsPage;
