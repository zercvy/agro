import React, { useEffect, useState } from 'react'
import axios from '../api/axios'

interface Props {
  selectedId: number | null
  onSelect: (id: number) => void
}

interface Windowsill {
  id: number
  side: string
  floor: number
}

const WindowsillList: React.FC<Props> = ({ selectedId, onSelect }) => {
  const [list, setList] = useState<Windowsill[]>([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/windowsills', { withCredentials: true })
        setList(res.data)
      } catch (err) {
        console.error('Ошибка при получении подоконников:', err)
      }
    }
    fetch()
  }, [])

  return (
    <div className="bg-white p-6 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">📋 Список подоконников</h3>
      {list.length === 0 ? (
        <p className="text-sm text-gray-500">Нет добавленных подоконников</p>
      ) : (
        <ul className="space-y-2">
          {list.map(w => (
            <li
              key={w.id}
              className={`cursor-pointer p-3 rounded border ${selectedId === w.id ? 'bg-yellow-100 border-yellow-500' : 'hover:bg-gray-50'}`}
              onClick={() => onSelect(w.id)}
            >
              <span className="font-medium">#{w.id}</span> — {w.side}, {w.floor} эт.
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default WindowsillList
