import React, { useEffect, useState } from 'react';
import WeatherMap from './WeatherMap';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lon: number;
  onSelect: (lat: number, lon: number) => void;
}

const WeatherMapModal: React.FC<Props> = ({ isOpen, onClose, lat, lon, onSelect }) => {
  const [selectedLat, setSelectedLat] = useState(lat);
  const [selectedLon, setSelectedLon] = useState(lon);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
        onClose();
        }
    };

    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
    }, [isOpen, onClose]);


  useEffect(() => {
    setSelectedLat(lat);
    setSelectedLon(lon);
  }, [lat, lon, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl h-[80vh] rounded-lg shadow-lg flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b font-semibold text-lg bg-gray-100 flex justify-between items-center">
        <span>Выберите местоположение</span>
        <button
            onClick={() => {
            if (!navigator.geolocation) {
                alert('Геолокация не поддерживается браузером');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                const { latitude, longitude } = position.coords;
                setSelectedLat(latitude);
                setSelectedLon(longitude);
                },
                () => {
                alert('Не удалось получить местоположение');
                }
            );
            }}
            className="text-sm px-3 py-1 bg-white text-gray-700 border rounded hover:bg-gray-100"
        >
            📍 Моё местоположение
        </button>
        </div>


        <div className="flex-1">
          <WeatherMap
            lat={selectedLat}
            lon={selectedLon}
            onChange={(lat, lon) => {
              setSelectedLat(lat);
              setSelectedLon(lon);
            }}
          />
        </div>

        <div className="px-4 py-3 border-t bg-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            📍 Широта: {selectedLat.toFixed(5)} | Долгота: {selectedLon.toFixed(5)}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-gray-700 hover:bg-gray-200"
            >
              Отмена
            </button>
            <button
              onClick={() => {
                onSelect(selectedLat, selectedLon);
                onClose();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMapModal;
