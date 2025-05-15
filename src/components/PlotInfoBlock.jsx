import React from 'react'

const PlotInfoBlock = ({ plot }) => (
  <div className="bg-white shadow p-6 rounded space-y-2 text-sm text-gray-700">
    <p><strong>Площадь:</strong> {plot.area} м²</p>
    <p><strong>Почва:</strong> {plot.soil}</p>
    <p><strong>Световые преграды:</strong> {plot.lightBarriers}</p>
    <p><strong>Ветровые преграды:</strong> {plot.windBarriers}</p>
    {plot.description && <p><strong>Комментарий:</strong> {plot.description}</p>}
  </div>
)

export default PlotInfoBlock
