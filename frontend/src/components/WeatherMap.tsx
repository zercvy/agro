import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// фикс иконки (иначе маркер не отображается)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

interface Props {
  lat: number;
  lon: number;
  onChange: (lat: number, lon: number) => void;
}

const LocationMarker: React.FC<{ onChange: (lat: number, lon: number) => void }> = ({ onChange }) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};

const WeatherMap: React.FC<Props> = ({ lat, lon, onChange }) => {
  const [position, setPosition] = useState<[number, number]>([lat, lon]);

  // Следим за изменениями координат от родителя (например, после "моё местоположение")
  useEffect(() => {
    setPosition([lat, lon]);
  }, [lat, lon]);

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} />
      <LocationMarker
        onChange={(newLat, newLon) => {
          setPosition([newLat, newLon]);
          onChange(newLat, newLon);
        }}
      />
    </MapContainer>
  );
};

export default WeatherMap;
