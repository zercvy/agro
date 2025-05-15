import React from 'react'

const AboutUsBlock = () => {
  return (
    <section className="bg-green-50 rounded-lg shadow p-6 my-8">
      <h2 className="text-2xl font-bold text-green-800 mb-4">👨‍🌾 О нас</h2>
      <p className="text-gray-700 mb-4">
        Agroассистент — это веб-приложение, созданное для помощи садоводам, фермерам и любителям городского земледелия.
        Мы объединяем технологии и практику, чтобы сделать выращивание растений понятным и результативным.
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>🎯 Наша цель — упростить принятие решений по уходу за растениями</li>
        <li>📊 Мы предоставляем рекомендации, аналитику и автоматический подбор культур</li>
        <li>🌍 Поддерживаем участки, теплицы, подоконники — в городе и за его пределами</li>
        <li>🔒 Данные пользователей хранятся безопасно и только для персональных рекомендаций</li>
      </ul>
      <div className="mt-4">
        <a href="/register" className="text-green-700 underline hover:text-green-900">
          Присоединиться к нам →
        </a>
      </div>
    </section>
  )
}

export default AboutUsBlock
