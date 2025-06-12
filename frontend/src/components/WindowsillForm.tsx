import React, { useState, ChangeEvent, FormEvent } from 'react'
import axios from '../api/axios'

interface Barrier {
  type: 'building' | 'tree'
  height: number
  distance: number
  width?: number
}

interface WindowsillFormData {
  side: string
  floor: string
  hasLamp: boolean
  barriers: Barrier[]
}

const WindowsillForm: React.FC = () => {
  const [form, setForm] = useState<WindowsillFormData>({
    side: '',
    floor: '',
    hasLamp: false,
    barriers: []
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm(prev => ({ ...prev, [name]: checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleBarrierChange = (index: number, field: keyof Barrier, value: string | number) => {
    const updated = [...form.barriers]
    updated[index] = { ...updated[index], [field]: value }
    setForm(prev => ({ ...prev, barriers: updated }))
  }

  const addBarrier = () => {
    setForm(prev => ({
      ...prev,
      barriers: [...prev.barriers, { type: 'building', height: 0, distance: 0 }]
    }))
  }

  const removeBarrier = (index: number) => {
    const updated = [...form.barriers]
    updated.splice(index, 1)
    setForm(prev => ({ ...prev, barriers: updated }))
  }

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()

  try {
    const res = await axios.post('/windowsills', {
      side: form.side,
      floor: +form.floor,
      hasLamp: form.hasLamp,
      barriers: form.barriers
    }, { withCredentials: true })

    alert('✅ Подоконник сохранён')
    console.log('Создан подоконник ID:', res.data.id)
  } catch (err) {
    console.error(err)
    alert('❌ Ошибка при сохранении подоконника')
  }
}


  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold">🪟 Создать подоконник</h3>

      <select
        name="side"
        value={form.side}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Сторона света</option>
        <option value="север">Север</option>
        <option value="юг">Юг</option>
        <option value="восток">Восток</option>
        <option value="запад">Запад</option>
      </select>

      <input
        type="number"
        name="floor"
        placeholder="Этаж"
        value={form.floor}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="hasLamp"
          checked={form.hasLamp}
          onChange={handleChange}
        />
        Есть фитолампа
      </label>

      {/* Преграды */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">🏗 Преграды</h4>
          <button
            type="button"
            onClick={addBarrier}
            className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          >
            + Добавить
          </button>
        </div>

        {form.barriers.map((barrier, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 items-end">
            <select
              value={barrier.type}
              onChange={(e) => handleBarrierChange(index, 'type', e.target.value)}
              className="border p-2 rounded"
            >
              <option value="building">Здание</option>
              <option value="tree">Дерево</option>
            </select>

            <input
              type="number"
              placeholder="Высота (м)"
              value={barrier.height}
              onChange={(e) => handleBarrierChange(index, 'height', +e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Расстояние (м)"
              value={barrier.distance}
              onChange={(e) => handleBarrierChange(index, 'distance', +e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Ширина (м)"
              value={barrier.width || ''}
              onChange={(e) => handleBarrierChange(index, 'width', +e.target.value)}
              className="border p-2 rounded"
            />

            <button
              type="button"
              onClick={() => removeBarrier(index)}
              className="text-red-500 hover:underline"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Сохранить подоконник
      </button>
    </form>
  )
}

export default WindowsillForm
