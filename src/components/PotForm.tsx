import React, { useState, ChangeEvent, FormEvent } from 'react'

interface PotFormState {
  volume: string
  culture: string
}

const PotForm: React.FC = () => {
  const [pot, setPot] = useState<PotFormState>({
    volume: '',
    culture: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPot({ ...pot, [name]: value })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Горшок:', pot)
    alert('Горшок добавлен (заглушка)')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold">🪴 Добавить горшок</h3>

      <input
        type="number"
        name="volume"
        placeholder="Объём (в литрах)"
        value={pot.volume}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        name="culture"
        placeholder="Культура"
        value={pot.culture}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
        Добавить горшок
      </button>
    </form>
  )
}

export default PotForm
