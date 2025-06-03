import React, { useEffect, useState, FormEvent } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import API from '../api/axios';
import BarrierFormModal from './BarrierFormModal';
import BarriersOverlay from './BarriersOverlay';
import { Geometry } from 'geojson';
import * as turf from '@turf/turf';
interface Barrier {
  id: number;
  type: 'light' | 'wind';
  height: number;
  width: number;
  distance: number;
  geometry: Geometry;
}

const DEFAULT_POSITION: [number, number] = [55.751244, 37.618423];

const DrawControls = ({ onDrawComplete }: { onDrawComplete: (geo: Geometry, area: number, perimeter: number) => void }) => {
  const map = useMap();

  useEffect(() => {
    map.pm.addControls({
      position: 'topright',
      drawCircle: false,
      drawMarker: false,
      drawPolyline: false,
      drawCircleMarker: false,
      drawRectangle: false
    });

    map.on('pm:create', (e: any) => {
      const layer = e.layer;
      const geo = layer.toGeoJSON().geometry;

      
      const area = turf.area(geo);
      const perimeter = turf.length(geo, { units: 'meters' });

      onDrawComplete(geo, area, perimeter);
    });

    return () => {
      map.pm.removeControls();
    };
  }, [map]);

  return null;
};

const PlotForm: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [soilType, setSoilType] = useState('');
  const [manualLocation, setManualLocation] = useState('');
  const [position, setPosition] = useState(DEFAULT_POSITION);

  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [area, setArea] = useState<number | null>(null);
  const [perimeter, setPerimeter] = useState<number | null>(null);

  const [plotId, setPlotId] = useState<number | null>(null);
  const [barriers, setBarriers] = useState<Barrier[]>([]);
  const [showBarrierModal, setShowBarrierModal] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  const handleDrawComplete = (geo: Geometry, area: number, perimeter: number) => {
    setGeometry(geo);
    setArea(area);
    setPerimeter(perimeter);
  };

  const fetchBarriers = async (id: number) => {
    try {
      const res = await API.get(`/plots/${id}/barriers`);
      setBarriers(res.data);
    } catch (err) {
      console.error(`Ошибка загрузки преград для участка ID ${id}:`, err);
    }
  };

  const handleManualLocation = async () => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${manualLocation}`);
      const data = await res.json();
      if (data[0]) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (err) {
      console.error('Ошибка при поиске местоположения:', err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!geometry) {
      alert('Нарисуйте участок на карте');
      return;
    }

    const payload = {
      name,
      type,
      soil_type: soilType,
      coordinates: geometry,
      area,
      perimeter,
    };

    try {
      const res = await API.get('/csrf-token');
      const csrfToken = res.data.csrfToken;

      const created = await API.post('/plots', payload, {
        headers: { 'X-CSRF-Token': csrfToken },
      });

      const id = created.data?.id;
      if (!id) {
        alert('Ошибка: сервер не вернул ID участка');
        return;
      }

      setPlotId(id);
      await fetchBarriers(id);

      alert('Участок успешно создан');
    } catch (err) {
      console.error('Ошибка при создании участка:', err);
      alert('Не удалось создать участок');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded p-6">
        <input
          className="w-full border p-2 rounded"
          placeholder="Название участка"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          className="w-full border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">Тип участка</option>
          <option value="поле">Поле</option>
          <option value="грядка">Грядка</option>
          <option value="теплица">Теплица</option>
        </select>

        <select
          className="w-full border p-2 rounded"
          value={soilType}
          onChange={(e) => setSoilType(e.target.value)}
          required
        >
          <option value="">Тип почвы</option>
          <option value="суглинок">Суглинок</option>
          <option value="супесь">Супесь</option>
          <option value="чернозём">Чернозём</option>
        </select>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Введите город/район"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button type="button" onClick={handleManualLocation} className="bg-blue-500 text-white px-3 py-2 rounded">
            Найти
          </button>
        </div>

        <div className="h-[400px] w-full border rounded overflow-hidden">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} attributionControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <DrawControls onDrawComplete={handleDrawComplete} />
            {plotId && <BarriersOverlay barriers={barriers} />}
          </MapContainer>
        </div>

        {area && <p>📐 Площадь: {(area / 10000).toFixed(2)} га</p>}
        {perimeter && <p>📏 Периметр: {perimeter.toFixed(2)} м</p>}

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          💾 Создать участок
        </button>

        {plotId && (
          <button
            type="button"
            onClick={() => setShowBarrierModal(true)}
            className="bg-indigo-600 text-white mt-2 px-4 py-2 rounded"
          >
            ➕ Добавить преграду
          </button>
        )}
      </form>

      {plotId && showBarrierModal && (
        <BarrierFormModal
          plotId={plotId}
          onClose={async () => {
            setShowBarrierModal(false);
            await fetchBarriers(plotId);
          }}
        />
      )}
    </>
  );
};

export default PlotForm;
