import React from 'react'

interface Culture {
  name: string
  light: string
  soil: string
  wind: string
  pot: string
  climate: string
}

const cultures: Culture[] = [
  {
    name: 'Томат',
    light: '8+ ч',
    soil: 'Суглинок',
    wind: 'Средняя защита',
    pot: '5+ л',
    climate: 'Умеренный',
  },
  {
    name: 'Базилик',
    light: '6–8 ч',
    soil: 'Супесь',
    wind: 'Низкая чувствительность',
    pot: '2+ л',
    climate: 'Тёплый',
  },
  {
    name: 'Салат',
    light: '4–6 ч',
    soil: 'Лёгкий',
    wind: 'Требует защиты',
    pot: '1–2 л',
    climate: 'Любой',
  },
]

const CultureTable: React.FC = () => {
  return (
    <div className="bg-white shadow rounded p-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Название</th>
            <th className="p-2">Освещенность</th>
            <th className="p-2">Почва</th>
            <th className="p-2">Ветер</th>
            <th className="p-2">Горшок</th>
            <th className="p-2">Климат</th>
          </tr>
        </thead>
        <tbody>
          {cultures.map((culture, i) => (
            <tr key={i} className="border-t">
              <td className="p-2 font-medium">{culture.name}</td>
              <td className="p-2">{culture.light}</td>
              <td className="p-2">{culture.soil}</td>
              <td className="p-2">{culture.wind}</td>
              <td className="p-2">{culture.pot}</td>
              <td className="p-2">{culture.climate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CultureTable
