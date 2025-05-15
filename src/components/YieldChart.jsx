import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { year: '2021', Томат: 3.2, Огурец: 2.5 },
  { year: '2022', Томат: 3.8, Огурец: 2.7 },
  { year: '2023', Томат: 4.1, Огурец: 3.1 }
]

const YieldChart = () => (
  <div>
    <h3 className="text-lg font-semibold mb-2">🌾 Урожайность по годам (т/га)</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Томат" stroke="#34d399" />
        <Line type="monotone" dataKey="Огурец" stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

export default YieldChart
