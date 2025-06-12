import React from 'react';

interface SunAzimuthProps {
  azimuth: number; // в градусах
}

const SunAzimuth: React.FC<SunAzimuthProps> = ({ azimuth }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        {/* Окружность */}
        <div className="absolute inset-0 border-2 border-gray-400 rounded-full" />

        {/* Направления */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 text-xs font-medium">N</div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs font-medium">E</div>
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 text-xs font-medium">S</div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-xs font-medium">W</div>

        {/* Стрелка азимута */}
        <div
          className="absolute w-0.5 h-20 bg-yellow-500 origin-bottom left-1/2 bottom-[50%] transform"
          style={{
            transform: `translateX(-50%) rotate(${azimuth}deg)`
          }}
        ></div>
      </div>

      {/* Подпись */}
      <p className="mt-2 text-sm">
        ☀️ Азимут солнца: <strong>{azimuth}°</strong>
      </p>
    </div>
  );
};

export default SunAzimuth;
