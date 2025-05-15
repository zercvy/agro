import React, { useState } from 'react'

const PlotForm = () => {
  const [form, setForm] = useState({
    name: '',
    soilType: '',
    lightBarrier: '',
    windBarrier: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
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

      {/* В будущем можно добавить карту */}

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
