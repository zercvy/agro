import React, { useState, ChangeEvent, FormEvent } from 'react'
import Modal from './Modal'

interface CropRecommendationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormState {
  light: string
  soil: string
  wind: string
  potSize: string
  region: string
}

const CropRecommendationModal: React.FC<CropRecommendationModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<FormState>({
    light: '',
    soil: '',
    wind: '',
    potSize: '',
    region: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert('🔍 Показаны рекомендации (заглушка)')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">🧠 Что посадить?</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <input type="text" name="light" placeholder="Освещенность (ч/день)" value={form.light} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="soil" placeholder="Тип почвы" value={form.soil} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="wind" placeholder="Ветровая защита" value={form.wind} onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="potSize" placeholder="Объём горшка (л)" value={form.potSize} onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="text" name="region" placeholder="Регион" value={form.region} onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">📊 Показать рекомендации</button>
      </form>
    </Modal>
  )
}

export default CropRecommendationModal
