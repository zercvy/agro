import React, { useState } from 'react'

const WindowsillForm = () => {
  const [form, setForm] = useState({
    side: '',
    floor: '',
    hasLamp: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Подоконник:', form)
    alert('Подоконник сохранён (заглушка)')
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

      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Сохранить подоконник
      </button>
    </form>
  )
}

export default WindowsillForm
