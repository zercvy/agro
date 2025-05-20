import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BasicFertilizerCalculator from '../components/BasicFertilizerCalculator'
import AdvancedFertilizerCalculator from '../components/AdvancedFertilizerCalculator'

const FertilizerPage: React.FC = () => {
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic')

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">🧪 Калькулятор удобрений</h2>

        <div className="flex items-center gap-6 mb-6 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="basic"
              checked={mode === 'basic'}
              onChange={() => setMode('basic')}
            />
            <span className="text-green-700 font-medium">Базовый</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="advanced"
              checked={mode === 'advanced'}
              onChange={() => setMode('advanced')}
            />
            <span className="text-blue-700 font-medium">Расширенный</span>
          </label>
        </div>

        {mode === 'basic' ? <BasicFertilizerCalculator /> : <AdvancedFertilizerCalculator />}
      </main>
      <Footer />
    </>
  )
}

export default FertilizerPage
