
// import React, { useState, useEffect, FormEvent } from 'react';
// import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
// import { EditControl } from 'react-leaflet-draw';
// import * as turf from '@turf/turf';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-draw/dist/leaflet.draw.css';
// import API from '../api/axios';

// const DEFAULT_POSITION: [number, number] = [55.751244, 37.618423]; // Москва

// interface Barrier {
//   type: string;
//   height: string;
//   distance: string;
//   width: string;
// }


// const PlotForm: React.FC = () => {
//   const [name, setName] = useState('');
//   const [type, setType] = useState('');
//   const [soilType, setSoilType] = useState('');
//   const [coordinates, setCoordinates] = useState<any>(null);
//   const [area, setArea] = useState<number | null>(null);
//   const [perimeter, setPerimeter] = useState<number | null>(null);
//   const [lightBarrier, setLightBarrier] = useState<Barrier>({ type: '', height: '', distance: '', width: '' });
//   const [windBarrier, setWindBarrier] = useState<Barrier>({ type: '', height: '', distance: '', width: '' });
//   const [position, setPosition] = useState(DEFAULT_POSITION);
//   const [manualLocation, setManualLocation] = useState('');

//   // Автопозиция
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((pos) => {
//         setPosition([pos.coords.latitude, pos.coords.longitude]);
//       });
//     }
//   }, []);

//   // Ручной ввод города
//   const handleManualLocation = async () => {
//     const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${manualLocation}`);
//     const data = await res.json();
//     if (data[0]) {
//       setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
//     }
//   };

//   // Обработка создания полигона
//   const onCreated = (e: any) => {
//     const layer = e.layer;
//     const geoJson = layer.toGeoJSON();
//     setCoordinates(geoJson.geometry);

//     const plotArea = turf.area(geoJson);
//     const plotPerimeter = turf.length(geoJson, { units: 'meters' });

//     setArea(plotArea);
//     setPerimeter(plotPerimeter);
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!coordinates) return alert('Нарисуйте участок на карте.');

//     try {
//       const res = await API.get('/csrf-token');
//       const csrfToken = res.data.csrfToken;

//       await API.post('/plots',
//         {
//           name,
//           type,
//           soil_type: soilType,
//           coordinates,
//           area,
//           perimeter,
//           lightBarrier,
//           windBarrier
//         },
//         {
//           headers: { 'X-CSRF-Token': csrfToken }
//         }
//       );

//       alert('Участок успешно создан');
//     } catch (err) {
//       console.error(err);
//       alert('Ошибка при создании участка');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded p-6">

//       <input className="w-full border p-2 rounded" placeholder="Название участка" value={name} onChange={(e) => setName(e.target.value)} required />

//       <select className="w-full border p-2 rounded" value={type} onChange={(e) => setType(e.target.value)} required>
//         <option value="">Тип участка</option>
//         <option value="поле">Поле</option>
//         <option value="грядка">Грядка</option>
//         <option value="теплица">Теплица</option>
//       </select>

//       <select className="w-full border p-2 rounded" value={soilType} onChange={(e) => setSoilType(e.target.value)} required>
//         <option value="">Тип почвы</option>
//         <option value="суглинок">Суглинок</option>
//         <option value="супесь">Супесь</option>
//         <option value="чернозём">Чернозём</option>
//       </select>

//       <div className="grid grid-cols-2 gap-2">
//         <input placeholder="Тип световой преграды" value={lightBarrier.type} onChange={(e) => setLightBarrier({ ...lightBarrier, type: e.target.value })} className="border p-2 rounded" />
//         <input placeholder="Высота" value={lightBarrier.height} onChange={(e) => setLightBarrier({ ...lightBarrier, height: e.target.value })} className="border p-2 rounded" />
//         <input placeholder="Расстояние" value={lightBarrier.distance} onChange={(e) => setLightBarrier({ ...lightBarrier, distance: e.target.value })} className="border p-2 rounded" />
//         <input placeholder="Ширина" value={lightBarrier.width} onChange={(e) => setLightBarrier({ ...lightBarrier, width: e.target.value })} className="border p-2 rounded" />
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <input placeholder="Тип ветровой преграды" value={windBarrier.type} onChange={(e) => setWindBarrier({ ...windBarrier, type: e.target.value })} className="border p-2 rounded" />
//         <input placeholder="Высота" value={windBarrier.height} onChange={(e) => setWindBarrier({ ...windBarrier, height: e.target.value })} className="border p-2 rounded" />
//         <input placeholder="Расстояние" value={windBarrier.distance} onChange={(e) => setWindBarrier({ ...windBarrier, distance: e.target.value })} className="border p-2 rounded" />
//         <input placeholder="Ширина" value={windBarrier.width} onChange={(e) => setWindBarrier({ ...windBarrier, width: e.target.value })} className="border p-2 rounded" />
//       </div>

//       <div className="flex gap-2 items-center">
//         <input type="text" placeholder="Введите город/район" value={manualLocation} onChange={(e) => setManualLocation(e.target.value)} className="border p-2 rounded w-full" />
//         <button type="button" onClick={handleManualLocation} className="bg-blue-500 text-white px-3 py-2 rounded">Найти</button>
//       </div>

//       <div className="h-[400px] w-full border rounded overflow-hidden">
//         <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           <FeatureGroup>
//             <EditControl
//               position="topright"
//               draw={{
//                 polygon: true,
//                 polyline: false,
//                 circle: false,
//                 rectangle: false,
//                 marker: false,
//                 circlemarker: false,
//               }}
//               onCreated={onCreated}
//             />
//           </FeatureGroup>
//         </MapContainer>
//       </div>

//       {area && <p>📐 Площадь: {(area / 10000).toFixed(2)} га</p>}
//       {perimeter && <p>📏 Периметр: {perimeter.toFixed(2)} м</p>}

//       <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
//         💾 Сохранить участок
//       </button>
//     </form>
//   );
// };

// export default PlotForm;


import React, { useState, useEffect, FormEvent } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import API from '../api/axios';

const DEFAULT_POSITION: [number, number] = [55.751244, 37.618423];

interface Barrier {
  type: string;
  height: string;
  distance: string;
  width: string;
}

interface PlotFormProps {
  isEdit?: boolean;
  initialData?: any;
  onSubmit?: (data: any) => void;
}

const PlotForm: React.FC<PlotFormProps> = ({ isEdit = false, initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || '');
  const [soilType, setSoilType] = useState(initialData?.soilType || '');
  const [coordinates, setCoordinates] = useState<any>(initialData?.coordinates || null);
  const [area, setArea] = useState<number | null>(initialData?.area || null);
  const [perimeter, setPerimeter] = useState<number | null>(initialData?.perimeter || null);
  const [lightBarrier, setLightBarrier] = useState<Barrier>(initialData?.lightBarrier || { type: '', height: '', distance: '', width: '' });
  const [windBarrier, setWindBarrier] = useState<Barrier>(initialData?.windBarrier || { type: '', height: '', distance: '', width: '' });
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [manualLocation, setManualLocation] = useState('');

  // Автоопределение геопозиции
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  // Ручной ввод города
  const handleManualLocation = async () => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${manualLocation}`);
    const data = await res.json();
    if (data[0]) {
      setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
    }
  };

  // Обработка отрисовки участка
  const onCreated = (e: any) => {
    const layer = e.layer;
    const geoJson = layer.toGeoJSON();
    setCoordinates(geoJson.geometry);

    const plotArea = turf.area(geoJson);
    const plotPerimeter = turf.length(geoJson, { units: 'meters' });

    setArea(plotArea);
    setPerimeter(plotPerimeter);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!coordinates) return alert('Нарисуйте участок на карте.');

    const payload = {
      name,
      type,
      soil_type: soilType,
      coordinates,
      area,
      perimeter,
      lightBarrier,
      windBarrier
    };

    if (isEdit && onSubmit) {
      await onSubmit(payload); // редактирование
    } else {
      try {
        const res = await API.get('/csrf-token');
        const csrfToken = res.data.csrfToken;

        await API.post('/plots', payload, {
          headers: { 'X-CSRF-Token': csrfToken }
        });

        alert('Участок успешно создан');
      } catch (err) {
        console.error(err);
        alert('Ошибка при создании участка');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded p-6">
      <input className="w-full border p-2 rounded" placeholder="Название участка" value={name} onChange={(e) => setName(e.target.value)} required />

      <select className="w-full border p-2 rounded" value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="">Тип участка</option>
        <option value="поле">Поле</option>
        <option value="грядка">Грядка</option>
        <option value="теплица">Теплица</option>
      </select>

      <select className="w-full border p-2 rounded" value={soilType} onChange={(e) => setSoilType(e.target.value)} required>
        <option value="">Тип почвы</option>
        <option value="суглинок">Суглинок</option>
        <option value="супесь">Супесь</option>
        <option value="чернозём">Чернозём</option>
      </select>

      <div className="grid grid-cols-2 gap-2">
        <input placeholder="Тип световой преграды" value={lightBarrier.type} onChange={(e) => setLightBarrier({ ...lightBarrier, type: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Высота" value={lightBarrier.height} onChange={(e) => setLightBarrier({ ...lightBarrier, height: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Расстояние" value={lightBarrier.distance} onChange={(e) => setLightBarrier({ ...lightBarrier, distance: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Ширина" value={lightBarrier.width} onChange={(e) => setLightBarrier({ ...lightBarrier, width: e.target.value })} className="border p-2 rounded" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input placeholder="Тип ветровой преграды" value={windBarrier.type} onChange={(e) => setWindBarrier({ ...windBarrier, type: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Высота" value={windBarrier.height} onChange={(e) => setWindBarrier({ ...windBarrier, height: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Расстояние" value={windBarrier.distance} onChange={(e) => setWindBarrier({ ...windBarrier, distance: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Ширина" value={windBarrier.width} onChange={(e) => setWindBarrier({ ...windBarrier, width: e.target.value })} className="border p-2 rounded" />
      </div>

      <div className="flex gap-2 items-center">
        <input type="text" placeholder="Введите город/район" value={manualLocation} onChange={(e) => setManualLocation(e.target.value)} className="border p-2 rounded w-full" />
        <button type="button" onClick={handleManualLocation} className="bg-blue-500 text-white px-3 py-2 rounded">Найти</button>
      </div>

      <div className="h-[400px] w-full border rounded overflow-hidden">
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FeatureGroup>
            <EditControl
              position="topright"
              draw={{
                polygon: true,
                polyline: false,
                circle: false,
                rectangle: false,
                marker: false,
                circlemarker: false,
              }}
              onCreated={onCreated}
            />
          </FeatureGroup>
        </MapContainer>
      </div>

      {area && <p>📐 Площадь: {(area / 10000).toFixed(2)} га</p>}
      {perimeter && <p>📏 Периметр: {perimeter.toFixed(2)} м</p>}

      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        💾 {isEdit ? 'Сохранить изменения' : 'Создать участок'}
      </button>
    </form>
  );
};

export default PlotForm;
