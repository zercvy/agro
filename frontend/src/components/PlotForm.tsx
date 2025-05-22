import React, { useState, ChangeEvent, FormEvent } from 'react'

interface FormData {
  name: string
  soilType: string
  lightBarrier: string
  windBarrier: string
}

const PlotForm: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    soilType: '',
    lightBarrier: '',
    windBarrier: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(form)
    alert('Участок создан (заглушка)')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded p-6">
      <input
        type="text"
        name="name"
        placeholder="Название участка"
        value={form.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <select
        name="soilType"
        value={form.soilType}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Тип почвы</option>
        <option value="суглинок">Суглинок</option>
        <option value="супесь">Супесь</option>
        <option value="чернозём">Чернозём</option>
      </select>

      <input
        type="text"
        name="lightBarrier"
        placeholder="Световые преграды (тип/высота/расстояние)"
        value={form.lightBarrier}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        name="windBarrier"
        placeholder="Ветровые преграды (тип/высота/расстояние)"
        value={form.windBarrier}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        💾 Сохранить участок
      </button>
    </form>
  )
}

export default PlotForm
