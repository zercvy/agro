import React from 'react'

interface Props {
  crops: string[]
}

const PlotCropList: React.FC<Props> = ({ crops }) => (
  <div className="bg-white shadow p-6 rounded">
    <h3 className="text-lg font-semibold mb-2">🌱 Культуры на участке</h3>
    <ul className="list-disc list-inside text-sm text-gray-700">
      {crops.map((c, i) => <li key={i}>{c}</li>)}
    </ul>
  </div>
)

export default PlotCropList
