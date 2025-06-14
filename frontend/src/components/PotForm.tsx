import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from '../api/axios';

interface Props {
  windowsillId: number;
}

interface Culture {
  id: number;
  name: string;
}

const PotForm: React.FC<Props> = ({ windowsillId }) => {
  const [pot, setPot] = useState({ name: '', volume: '', cultureId: '' });
  const [cultures, setCultures] = useState<Culture[]>([]);

  useEffect(() => {
    axios.get('/cultures')
      .then(res => setCultures(res.data))
      .catch(err => console.error('Ошибка загрузки культур:', err));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPot({ ...pot, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('/pots', {
        name: pot.name,
        volume: +pot.volume,
        cultureId: +pot.cultureId,
        windowsillId,
      });
      alert('✅ Горшок добавлен');
      setPot({ name: '', volume: '', cultureId: '' });
    } catch (err) {
      console.error(err);
      alert('❌ Ошибка при добавлении горшка');
    }
  };

  if (!windowsillId) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow mt-6">
      <h3 className="text-lg font-semibold">🪴 Добавить горшок для подоконника #{windowsillId}</h3>

      <input
        type="text"
        name="name"
        placeholder="Название горшка"
        value={pot.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="number"
        name="volume"
        placeholder="Объём (в литрах)"
        value={pot.volume}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <select
        name="cultureId"
        value={pot.cultureId}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Выберите культуру</option>
        {cultures.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
        Добавить горшок
      </button>
    </form>
  );
};

export default PotForm;
