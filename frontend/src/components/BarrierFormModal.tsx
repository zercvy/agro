import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { GeoJSON } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import API from '../api/axios';

interface Props {
  plotId: number;
  onClose: () => void;
}

const DEFAULT_POSITION: [number, number] = [55.751244, 37.618423];

const BarrierMap = ({ onDrawComplete }: { onDrawComplete: (geometry: GeoJSON) => void }) => {
  const map = useMap();
  const drawnLayerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    // Включение тулбара Geoman
    map.pm.addControls({
      position: 'topleft',
      drawCircle: false,
      drawPolyline: false,
      drawMarker: false,
      drawPolygon: false,
      drawCircleMarker: false,
      drawRectangle: true,
    });

    map.on('pm:create', (e: any) => {
      if (drawnLayerRef.current) {
        map.removeLayer(drawnLayerRef.current);
      }

      if (e.shape !== 'Rectangle') {
        alert('Разрешено только рисование прямоугольников.');
        return;
      }

      drawnLayerRef.current = e.layer;
      const geoJson = e.layer.toGeoJSON();
      onDrawComplete(geoJson.geometry);
    });

    return () => {
      map.pm.removeControls();
    };
  }, [map, onDrawComplete]);

  return null;
};

const BarrierFormModal: React.FC<Props> = ({ plotId, onClose }) => {
  const [geometry, setGeometry] = useState<any | null>(null);
  const [form, setForm] = useState({
    type: '',
    height: '',
    width: '',
    distance: ''
  });

  const handleSubmit = async () => {
    if (!geometry) return alert('Сначала нарисуйте преграду на карте.');
    const { type, height, width, distance } = form;

    if (!type || !height || !width || !distance) {
      return alert('Заполните все поля.');
    }

    try {
      const res = await API.get('/csrf-token');
      const csrfToken = res.data.csrfToken;

      await API.post(`/plots/${plotId}/barriers`, {
        type,
        height: parseFloat(height),
        width: parseFloat(width),
        distance: parseFloat(distance),
        geometry
      }, {
        headers: { 'X-CSRF-Token': csrfToken }
      });

      alert('Преграда добавлена');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении преграды');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✖</button>
        <h3 className="text-lg font-semibold mb-4">Добавление преграды</h3>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border p-2 rounded">
            <option value="">Тип преграды</option>
            <option value="light">Световая</option>
            <option value="wind">Ветровая</option>
          </select>
          <input placeholder="Высота (м)" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Ширина (м)" value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Расстояние до участка (м)" value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} className="border p-2 rounded" />
        </div>

        <div className="h-[300px] mb-4">
          <MapContainer center={DEFAULT_POSITION} zoom={13} style={{ height: '100%', width: '100%' }} attributionControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <BarrierMap onDrawComplete={setGeometry} />
          </MapContainer>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Отмена</button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">💾 Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default BarrierFormModal;
