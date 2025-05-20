import React, { useState, ChangeEvent, FormEvent } from 'react'

interface FormState {
  area: string
  soilType: string
  humus: string
  ph: string
  p: string
  k: string
  crop: string
  previousCrop: string
  yieldGoal: string
  organicType: string
  organicDose: string
}

interface Result {
  fertilizer: string
  dose: string
  repeat: string
}

const BasicFertilizerCalculator: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    area: '',
    soilType: '',
    humus: '',
    ph: '',
    p: '',
    k: '',
    crop: '',
    previousCrop: '',
    yieldGoal: '',
    organicType: '',
    organicDose: ''
  })

  const [result, setResult] = useState<Result | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const dose = parseFloat(form.area || '1') * 5
    setResult({
      fertilizer: 'Комплексное NPK 10-10-10',
      dose: `${dose.toFixed(1)} кг`,
      repeat: 'Повторить через 14 дней'
    })
  }

  const handleReset = () => {
    setForm({
      area: '', soilType: '', humus: '', ph: '', p: '', k: '',
      crop: '', previousCrop: '', yieldGoal: '', organicType: '', organicDose: ''
    })
    setResult(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded text-sm">
      <h3 className="text-lg font-semibold">🌱 Агрокалькулятор (базовый)</h3>

      <div>
        <label>Площадь посева, га</label>
        <input name="area" type="number" min="0.1" max="100000" value={form.area} onChange={handleChange} className="w-full border p-2 rounded" required />
      </div>

      <fieldset className="border-t pt-4">
        <legend className="text-sm font-medium text-gray-600">Почва</legend>
        <select name="soilType" value={form.soilType} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Тип почвы</option>
          <option>Суглинок</option>
          <option>Супесь</option>
          <option>Чернозём</option>
        </select>
        <input name="humus" type="number" step="0.1" placeholder="Гумус, %" value={form.humus} onChange={handleChange} className="w-full border p-2 rounded mt-2" required />
        <input name="ph" type="number" step="0.1" placeholder="Кислотность (pH)" value={form.ph} onChange={handleChange} className="w-full border p-2 rounded mt-2" required />
        <input name="p" type="number" step="0.1" placeholder="Фосфор (P₂O₅), мг/кг" value={form.p} onChange={handleChange} className="w-full border p-2 rounded mt-2" required />
        <input name="k" type="number" step="0.1" placeholder="Калий (K₂O), мг/кг" value={form.k} onChange={handleChange} className="w-full border p-2 rounded mt-2" required />
      </fieldset>

      <fieldset className="border-t pt-4">
        <legend className="text-sm font-medium text-gray-600">Культура</legend>
        <input name="crop" placeholder="Засеваемая культура" value={form.crop} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="previousCrop" placeholder="Предыдущая культура" value={form.previousCrop} onChange={handleChange} className="w-full border p-2 rounded mt-2" />
        <input name="yieldGoal" type="number" placeholder="Планируемый урожай, т/га" value={form.yieldGoal} onChange={handleChange} className="w-full border p-2 rounded mt-2" required />
      </fieldset>

      <fieldset className="border-t pt-4">
        <legend className="text-sm font-medium text-gray-600">Удобрение (необязательно)</legend>
        <input name="organicType" placeholder="Тип органического удобрения" value={form.organicType} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="organicDose" type="number" placeholder="Доза органики, т/га" value={form.organicDose} onChange={handleChange} className="w-full border p-2 rounded mt-2" />
      </fieldset>

      <div className="flex gap-4 mt-6">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Рассчитать</button>
        <button type="button" onClick={handleReset} className="border border-gray-400 px-4 py-2 rounded text-gray-600 hover:bg-gray-100">Очистить</button>
      </div>

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded text-sm text-gray-800">
          <p><strong>Рекомендовано:</strong> {result.fertilizer}</p>
          <p><strong>Дозировка:</strong> {result.dose}</p>
          <p><strong>Применение:</strong> {result.repeat}</p>
        </div>
      )}
    </form>
  )
}

export default BasicFertilizerCalculator
