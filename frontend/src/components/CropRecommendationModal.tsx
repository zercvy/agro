// import React, { useState, ChangeEvent, FormEvent } from 'react'
// import Modal from './Modal'

// interface CropRecommendationModalProps {
//   isOpen: boolean
//   onClose: () => void
// }

// interface FormState {
//   light: string
//   soil: string
//   wind: string
//   potSize: string
//   region: string
// }

// const CropRecommendationModal: React.FC<CropRecommendationModalProps> = ({ isOpen, onClose }) => {
//   const [form, setForm] = useState<FormState>({
//     light: '',
//     soil: '',
//     wind: '',
//     potSize: '',
//     region: '',
//   })

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     alert('🔍 Показаны рекомендации (заглушка)')
//   }

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <h2 className="text-xl font-bold mb-4">🧠 Что посадить?</h2>
//       <form onSubmit={handleSubmit} className="space-y-4 text-sm">
//         <input type="text" name="light" placeholder="Освещенность (ч/день)" value={form.light} onChange={handleChange} className="w-full border p-2 rounded" required />
//         <input type="text" name="soil" placeholder="Тип почвы" value={form.soil} onChange={handleChange} className="w-full border p-2 rounded" required />
//         <input type="text" name="wind" placeholder="Ветровая защита" value={form.wind} onChange={handleChange} className="w-full border p-2 rounded" />
//         <input type="text" name="potSize" placeholder="Объём горшка (л)" value={form.potSize} onChange={handleChange} className="w-full border p-2 rounded" />
//         <input type="text" name="region" placeholder="Регион" value={form.region} onChange={handleChange} className="w-full border p-2 rounded" />
//         <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">📊 Показать рекомендации</button>
//       </form>
//     </Modal>
//   )
// }

// export default CropRecommendationModal


import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Modal from './Modal';
import API from '../api/axios';

interface CropRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  light: string;
  soil: string;
  wind: string;
  potSize: string;
  region: string;
}

const climateZones = ['умеренная', 'континентальная', 'субтропическая', 'тропическая'];

const CropRecommendationModal: React.FC<CropRecommendationModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<FormState>({
    light: '',
    soil: '',
    wind: '',
    potSize: '',
    region: '',
  });

  const [soils, setSoils] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    API.get('/csrf-token').then(res => {
      setCsrfToken(res.data.csrfToken);
    });

    API.get('/soil-types')
      .then(res => {
        const names = res.data.map((soil: any) => soil.name);
        setSoils(names);
      })
      .catch(err => console.error('Ошибка загрузки почв:', err));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('📤 Данные формы:', form);

      const { data } = await API.post(
        '/recommendations',
        {
          soil: form.soil,
          potSize: form.potSize,
          wind: form.wind,
          region: form.region,
        },
        { headers: { 'X-CSRF-Token': csrfToken } }
      );
      console.log('📥 Ответ от API:', data); // 👈 это важно
      setRecommendations(data.map((item: any) => item.name));
    } catch (err) {
      console.error('Ошибка получения рекомендаций:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">🧠 Что посадить?</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        <select
          name="soil"
          value={form.soil}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Выберите тип почвы</option>
          {soils.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="light"
          placeholder="Освещенность (ч/день)"
          value={form.light}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          
        />

        <input
          type="text"
          name="wind"
          placeholder="Ветровая защита (да/нет)"
          value={form.wind}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="potSize"
          placeholder="Объём горшка (л)"
          value={form.potSize}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="region"
          value={form.region}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Выберите регион</option>
          {climateZones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          📊 Показать рекомендации
        </button>
      </form>

      {recommendations.length > 0 && (
        <div className="mt-4 p-4 border rounded bg-green-50">
          <h3 className="font-semibold mb-2">✅ Рекомендованные культуры:</h3>
          <ul className="list-disc list-inside">
            {recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default CropRecommendationModal;
