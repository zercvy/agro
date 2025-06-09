import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API from '../api/axios';
import CultureSearchTree from '../components/CultureSearchTree';

interface Culture {
  id: number;
  name: string;
  description?: string;
  usedIn: string[]; // названия участков/горшков
}

interface ObjectMap {
  plots: { id: number; name: string }[];
  pots: { id: number; name: string }[];
}




const MyCulturesPage: React.FC = () => {
  const [myCultures, setMyCultures] = useState<Culture[]>([]);
  const [objects, setObjects] = useState<ObjectMap>({ plots: [], pots: [] });
  const [loading, setLoading] = useState(true);
  const [selectedObjects, setSelectedObjects] = useState<Record<number, string>>({});

  useEffect(() => {
    API.get('/user/cultures')
      .then(res => setMyCultures(res.data))
      .catch(err => console.error('Ошибка загрузки моих культур', err));

    API.get('/user/objects')
      .then(res => setObjects(res.data))
      .catch(err => console.error('Ошибка загрузки объектов пользователя', err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddCulture = async (culture: { id: number; name: string }) => {
    try {
      await API.post('/user/cultures', { cultureId: culture.id });
      setMyCultures(prev => [...prev, { ...culture, description: '', usedIn: [] }]);
    } catch {
      alert('Ошибка при добавлении культуры');
    }
  };

  const handleDeleteCulture = async (id: number) => {
    if (!confirm('Удалить культуру из профиля?')) return;
    try {
      await API.delete(`/user/cultures/${id}`);
      setMyCultures(prev => prev.filter(c => c.id !== id));
    } catch {
      alert('Ошибка при удалении');
    }
  };

  const handleBindCulture = async (cultureId: number, bindTo: string) => {
    const [type, id] = bindTo.split('-');
    try {
      await API.post('/user/cultures/bind', {
        cultureId,
        targetType: type,
        targetId: Number(id),
      });
      // Простейшее обновление: можно сделать get /user/cultures, но пока просто метка
      const { data } = await API.get('/user/cultures');
    setMyCultures(data);

    } catch {
      alert('Ошибка при привязке культуры');
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4">🌱 Мои культуры</h2>
          {loading ? (
            <p className="text-gray-500">Загрузка...</p>
          ) : myCultures.length === 0 ? (
            <p className="text-gray-600">Вы ещё не добавили ни одной культуры.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myCultures.map((culture) => (
                <li
                  key={culture.id}
                  className="p-4 bg-white shadow rounded flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{culture.name}</h3>
                     
                      <p className="text-xs mt-1 text-gray-500">
                       {culture.usedIn?.length > 0
                        ? `Используется: ${culture.usedIn.join(', ')}`
                        : 'Не используется'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCulture(culture.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Удалить
                    </button>
                  </div>

                  {(!culture.usedIn || culture.usedIn.length === 0) && (

                    <div className="mt-3">
                      <label className="text-sm block mb-1">Привязать к объекту:</label>
                      <select
                        value={selectedObjects[culture.id] || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedObjects(prev => ({ ...prev, [culture.id]: value }));
                            handleBindCulture(culture.id, value);
                            setTimeout(() => {
                            setSelectedObjects(prev => ({ ...prev, [culture.id]: '' }));
                            }, 100); // чуть позже, чтобы select отреагировал
                        }}
                        className="border rounded px-2 py-1 w-full"
                        >
                        <option value="">Выберите...</option>
                        {objects.plots.map(p => (
                            <option key={`plot-${p.id}`} value={`plot-${p.id}`}>{p.name}</option>
                        ))}
                        {objects.pots.map(p => (
                            <option key={`pot-${p.id}`} value={`pot-${p.id}`}>{p.name}</option>
                        ))}
                    </select>

                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">📚 Добавить культуру</h2>
          <CultureSearchTree onSelect={handleAddCulture} />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MyCulturesPage;
