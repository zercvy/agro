import React from 'react'

const AboutBlock: React.FC = () => {
  return (
    <section className="bg-white rounded-lg shadow p-6 my-6">
      <h2 className="text-xl font-semibold mb-4">💡 О проекте</h2>
      <p className="mb-2">🌱 Умный агроассистент для садоводов и фермеров.</p>
      <ul className="list-disc list-inside space-y-1">
        <li> Учёт участков и горшков</li>
        <li> Расчёт освещённости, ветра, погоды</li>
        <li> Рекомендации по культурам и уходу</li>
        <li> Подбор культур на основе реальных условий</li>
      </ul>
      <div className="mt-4 space-x-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Начать пользоваться
        </button>
        <button className="underline text-green-600">
          Подробнее о проекте
        </button>
      </div>
    </section>
  )
}

export default AboutBlock
