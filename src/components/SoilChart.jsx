import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { year: '2021', Гумус: 4.5, pH: 6.8 },
  { year: '2022', Гумус: 4.2, pH: 6.6 },
  { year: '2023', Гумус: 3.9, pH: 6.4 }
]

const SoilChart = () => (
  <div>
    <h3 className="text-lg font-semibold mb-2">🧪 Показатели почвы</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Гумус" fill="#f59e0b" />
        <Bar dataKey="pH" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  </div>
)

export default SoilChart
