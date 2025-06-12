

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import API from '../api/axios'

interface FormState {
  area: number      // га
  yieldGoal: number // т/га
  crop: string      // id культуры
  soilType: string  // id почвы
  humus: number     // %
  ph: number
  soilP: number     // мг/кг
  soilK: number     // мг/кг
  organicType: string // id органики
  organicDose: number  // т/га
}

interface SoilType { id: number; name: string; ph_min: number; ph_max: number }
interface CultureNode { id: number; name: string; children: CultureNode[] }
interface CultureCategory { category: string; items: CultureNode[] }
interface Norm { nutrient_id: number; amount_per_t: number }
interface FertilizerType { id: number; name: string; /* ... */ }
interface OrganicType { id: number; n_percent: number; p2o5_percent: number; k2o_percent: number }

const KE = { 1: 0.5, 2: 0.2, 3: 0.6 }  // коэффициенты усвоения: N=1, P₂O₅=2, K₂O=3
const SOIL_MASS_FACTOR = 2.6            // перевод мг/кг → кг/га (0–20 см)

const BasicFertilizerCalculator: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    area: 1, yieldGoal: 1, crop: '', soilType: '',
    humus: 2, ph: 6, soilP: 0, soilK: 0,
    organicType: '', organicDose: 0
  })

  const [soilTypes, setSoilTypes] = useState<SoilType[]>([])
  const [tree, setTree] = useState<CultureCategory[]>([])
  const [norms, setNorms] = useState<Norm[]>([])
  const [fertTypes, setFertTypes] = useState<FertilizerType[]>([])
  const [orgTypes, setOrgTypes] = useState<OrganicType[]>([])
  const [result, setResult] = useState<{ Dn: number; Dp: number; Dk: number } | null>(null)

  useEffect(() => {
    API.get<SoilType[]>('/soil-types')
       .then(r => setSoilTypes(r.data))
       .catch(() => setSoilTypes([]))
    API.get<CultureCategory[]>('/cultures/tree-by-categories').then(r => setTree(r.data))
    API.get<FertilizerType[]>('/fertilizer-types').then(r => setFertTypes(r.data))
    API.get<OrganicType[]>('/organic-types').then(r => setOrgTypes(r.data))
  }, [])

  useEffect(() => {
    if (form.crop) {
      API.get<Norm[]>(`/nutrient-norms/by-culture/${form.crop}`)
         .then(r => setNorms(r.data))
    } else {
      setNorms([])
    }
  }, [form.crop])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]: e.target.type === 'number'
        ? parseFloat(value)
        : value
    } as any))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const { area, yieldGoal, humus, soilP, soilK, organicType, organicDose } = form

    // 1. Расчёт для каждого элемента: D = U·R – (S·Ke) – O
    const D: Record<string, number> = {Dn:0, Dp:0, Dk:0}
    const elemMap = { 1: 'Dn', 2: 'Dp', 3: 'Dk' }

    norms.forEach(n => {
      const key = elemMap[n.nutrient_id] as 'Dn'|'Dp'|'Dk'
      // U·R
      const UR = yieldGoal * n.amount_per_t * area
      // S·Ke (soil in kg/ha = mg/kg * factor)
      const Skg = (n.nutrient_id === 1 ? soilP : soilK) * SOIL_MASS_FACTOR
      const SK = Skg * KE[n.nutrient_id]
      // O: органика (т/га → кг/га питательного элемента)
      const org = orgTypes.find(o => o.id === +organicType)
      let O = 0
      if (org) {
        const pct = n.nutrient_id === 1
          ? org.n_percent
          : n.nutrient_id === 2
            ? org.p2o5_percent
            : org.k2o_percent
        // organicDose (т/га) × 1000 (кг) × pct/100
        O = organicDose * 1000 * (pct / 100)
      }
      D[key] = Math.max(0, UR - SK - O)
    })

    setResult({ Dn: +D.Dn.toFixed(1), Dp: +D.Dp.toFixed(1), Dk: +D.Dk.toFixed(1) })
  }

  const renderTree = (nodes: CultureNode[], prefix = '') =>
    nodes.flatMap(n => [
      <option key={n.id} value={String(n.id)}>{prefix + n.name}</option>,
      ...renderTree(n.children, prefix + '– ')
    ])

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow rounded">
      <h3 className="text-xl font-semibold">🌱 Калькулятор удобрений</h3>

      {/* Площадь и урожай */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Площадь (га)</label>
          <input type="number" name="area" step="0.1"
            value={form.area} onChange={handleChange}
            className="w-full border p-2 rounded mt-1"/>
        </div>
        <div>
          <label>Планируемый урожай (т/га)</label>
          <input type="number" name="yieldGoal" step="0.1"
            value={form.yieldGoal} onChange={handleChange}
            className="w-full border p-2 rounded"/>
        </div>
      </div>

      {/* Почва */}
      <fieldset className="border p-4 rounded">
        <legend>Почва</legend>
        <div className="mb-4">
          <label className="block mb-1">Тип почвы</label>
          <select
            name="soilType"
            value={form.soilType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Выберите тип почвы</option>
            {soilTypes.map(s => (
              <option key={s.id} value={String(s.id)}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label>Гумус (%)</label>
            <input type="number" name="humus" step="0.1"
              value={form.humus} onChange={handleChange}
              className="w-full border p-2 rounded"/>
          </div>
          <div className="flex-1">
            <label>P₂O₅ (мг/кг)</label>
            <input type="number" name="soilP" step="0.1"
              value={form.soilP} onChange={handleChange}
              className="w-full border p-2 rounded"/>
          </div>
          <div className="flex-1">
            <label>K₂O (мг/кг)</label>
            <input type="number" name="soilK" step="0.1"
              value={form.soilK} onChange={handleChange}
              className="w-full border p-2 rounded"/>
          </div>
        </div>
      </fieldset>

      {/* Культура */}
      <div>
        <label>Культура</label>
        <select name="crop" value={form.crop} onChange={handleChange}
          className="w-full border p-2 rounded" required>
          <option value="">Выберите культуру</option>
          {tree.map(cat => (
            <optgroup key={cat.category} label={cat.category}>
              {renderTree(cat.items)}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Органика */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Органика</label>
          <select name="organicType" value={form.organicType} onChange={handleChange}
            className="w-full border p-2 rounded">
            <option value="">—</option>
            {orgTypes.map(o => (
              <option key={o.id} value={String(o.id)}>{o.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Доза органики (т/га)</label>
          <input type="number" name="organicDose" step="0.1"
            value={form.organicDose} onChange={handleChange}
            className="w-full border p-2 rounded"/>
        </div>
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Рассчитать
      </button>

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <p><strong>Азот (N):</strong> {result.Dn} кг/га</p>
          <p><strong>Фосфор (P₂O₅):</strong> {result.Dp} кг/га</p>
          <p><strong>Калий (K₂O):</strong> {result.Dk} кг/га</p>
        </div>
      )}
    </form>
  )
}

export default BasicFertilizerCalculator
