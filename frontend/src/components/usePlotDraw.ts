import { useState } from 'react';
import * as turf from '@turf/turf';
import { Geometry } from 'geojson';

export interface PlotGeometry {
  coordinates: Geometry;
  area: number;
  perimeter: number;
}

const usePlotDraw = () => {
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [area, setArea] = useState<number | null>(null);
  const [perimeter, setPerimeter] = useState<number | null>(null);

  const handleCreated = (e: any) => {
    const geoJson = e.layer.toGeoJSON();
    if (e.layerType === 'polygon') {
      const geom = geoJson.geometry;
      setGeometry(geom);
      setArea(turf.area(geoJson));
      setPerimeter(turf.length(geoJson, { units: 'meters' }));
    }
  };

  const reset = () => {
    setGeometry(null);
    setArea(null);
    setPerimeter(null);
  };

  return {
    geometry,
    area,
    perimeter,
    handleCreated,
    reset,
  };
};

export default usePlotDraw;
