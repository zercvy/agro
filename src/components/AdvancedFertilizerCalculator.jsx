import React, { useState } from 'react'

const AdvancedFertilizerCalculator = () => {
  const [fieldForm, setFieldForm] = useState({
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

  const [potForm, setPotForm] = useState({
    potVolume: '',
    potCulture: '',
    potGoal: ''
  })

  const [result, setResult] = useState(null)
  const [potResult, setPotResult] = useState(null)

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setFieldForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePotChange = (e) => {
    const { name, value } = e.target
    setPotForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFieldSubmit = (e) => {
    e.preventDefault()
    const dose = parseFloat(fieldForm.area || 1) * 4.5
    setResult({
      fertilizer: 'NPK 12-12-17 + Mg + S',
      dose: `${dose.toFixed(1)} кг`,
      repeat: 'Через 10–14 дней'
    })
  }

  const handlePotSubmit = (e) => {
    e.preventDefault()
    const dose = parseFloat(potForm.potVolume || 1) * 3
    setPotResult({
      fertilizer: 'Жидкое комплексное удобрение',
      dose: `${dose.toFixed(1)} мл`,
      note: 'Поливать раз в 7 дней'
    })
  }

  return (
    <div className="space-y-12">

      {/* --- Расчёт для поля --- */}
      <form onSubmit={handleFieldSubmit} className="space-y-4 bg-white p-6 rounded shadow text-sm">
        <h3 className="text-lg font-semibold">🌾 Участок</h3>

        <div>
          <label>Площадь, га</label>
          <input name="area" type="number" value={fieldForm.area} onChange={handleFieldChange} className="w-full border p-2 rounded" required />
        </div>

        <fieldset className="border-t pt-4">
          <legend className="text-sm text-gray-600">Почва</legend>
          <select name="soilType" value={fieldForm.soilType} onChange={handleFieldChange} className="w-full border p-2 rounded" required>
            <option value="">Тип почвы</option>
            <option>Суглинок</option>
            <option>Супесь</option>
            <option>Чернозём</option>
          </select>
          <input name="humus" type="number" placeholder="Гумус, %" value={fieldForm.humus} onChange={handleFieldChange} className="w-full border p-2 rounded mt-2" />
          <input name="ph" type="number" placeholder="pH" value={fieldForm.ph} onChange={handleFieldChange} className="w-full border p-2 rounded mt-2" />
          <input name="p" type="number" placeholder="Фосфор (P)" value={fieldForm.p} onChange={handleFieldChange} className="w-full border p-2 rounded mt-2" />
          <input name="k" type="number" placeholder="Калий (K)" value={fieldForm.k} onChange={handleFieldChange} className="w-full border p-2 rounded mt-2" />
        </fieldset>

        <fieldset className="border-t pt-4">
          <legend className="text-sm text-gray-600">Культура</legend>
          <input name="crop" placeholder="Культура" value={fieldForm.crop} onChange={handleFieldChange} className="w-full border p-2 rounded" />
          <input name="previousCrop" placeholder="Предыдущая культура" value={fieldForm.previousCrop} onChange={handleFieldChange} className="w-full border p-2 rounded mt-2" />
          <input name="yieldGoal" placeholder="Планируемый урожай, т/га" value={fieldForm.yieldGoal} onChange={handleFieldChange} className="w-full border p-2 rounded mt-2" />
        </fieldset>

        <fieldset className="border-t pt-4">
          <legend className="text-sm text-gray-600">Органика</legend>
          <input name="organicType" placeholder="Тип органического удобрения" value={fieldForm.organicType} onChange={handleFieldChange} className="w-full border p-2 rounded" />
          <input name="organicDose" placeholder="Доза, т/га" value={fieldForm.organicDose} onChange={handleFieldChange} className="w-full border p-2 rounded mt-2" />
        </fieldset>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">📊 Рассчитать для поля</button>

        {result && (
          <div className="mt-4 bg-blue-50 border border-blue-300 p-4 rounded text-sm">
            <p>📦 <strong>{result.fertilizer}</strong></p>
            <p>💧 {result.dose}</p>
            <p>📅 {result.repeat}</p>
          </div>
        )}
      </form>

      {/* --- Расчёт для горшка --- */}
      <form onSubmit={handlePotSubmit} className="space-y-4 bg-white p-6 rounded shadow text-sm">
        <h3 className="text-lg font-semibold">🪴 Горшок</h3>

        <input
          name="potVolume"
          type="number"
          placeholder="Объём горшка, л"
          value={potForm.potVolume}
          onChange={handlePotChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="potCulture"
          placeholder="Культура"
          value={potForm.potCulture}
          onChange={handlePotChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="potGoal"
          value={potForm.potGoal}
          onChange={handlePotChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Цель</option>
          <option value="рост">Рост</option>
          <option value="плодоношение">Плодоношение</option>
        </select>

        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">📊 Рассчитать для горшка</button>

        {potResult && (
          <div className="mt-4 bg-purple-50 border border-purple-300 p-4 rounded text-sm">
            <p>🧴 <strong>{potResult.fertilizer}</strong></p>
            <p>💧 {potResult.dose}</p>
            <p>📅 {potResult.note}</p>
          </div>
        )}
      </form>
    </div>
  )
}

export default AdvancedFertilizerCalculator
