import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { Geometry, GeoJsonObject } from 'geojson';

interface Barrier {
  id: number;
  type: 'light' | 'wind';
  height: number;
  width: number;
  distance: number;
  geometry: Geometry;
}

interface Props {
  barriers: Barrier[];
}

const BarriersOverlay: React.FC<Props> = ({ barriers }) => {
  const getStyle = (type: string) => ({
    color: type === 'light' ? '#facc15' : '#38bdf8',
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.2,
  });

  return (
    <>
      {barriers.map((barrier) => {
        if (!barrier.geometry || !barrier.geometry.type) return null;

        return (
          <GeoJSON
            key={barrier.id}
            data={{
              type: 'Feature',
              geometry: barrier.geometry,
              properties: { ...barrier },
            } as GeoJsonObject}
            style={() => getStyle(barrier.type)}
            eventHandlers={{
              click: (e) => {
                const props = e.sourceTarget.feature?.properties;
                if (props) {
                  alert(
                    `Тип: ${props.type}\nВысота: ${props.height} м\nШирина: ${props.width} м\nРасстояние: ${props.distance} м`
                  );
                }
              },
            }}
          />
        );
      })}
    </>
  );
};

export default BarriersOverlay;
