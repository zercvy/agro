import React from 'react'

interface Plot {
  area: number
  soil: string
  lightBarriers: string
  windBarriers: string
  description?: string
}

interface Props {
  plot: Plot
}

const PlotInfoBlock: React.FC<Props> = ({ plot }) => (
  <div className="bg-white shadow p-6 rounded space-y-2 text-sm text-gray-700">
    <p><strong>Площадь:</strong> {plot.area} м²</p>
    <p><strong>Почва:</strong> {plot.soil}</p>
    <p><strong>Световые преграды:</strong> {plot.lightBarriers}</p>
    <p><strong>Ветровые преграды:</strong> {plot.windBarriers}</p>
    {plot.description && <p><strong>Комментарий:</strong> {plot.description}</p>}
  </div>
)

export default PlotInfoBlock
