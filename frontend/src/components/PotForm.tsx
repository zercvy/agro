// import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
// import axios from '../api/axios'

// interface PotFormState {
//   volume: string
//   culture: string
//   windowsillId: string
// }

// interface Windowsill {
//   id: number
//   side: string
//   floor: number
// }

// const PotForm: React.FC = () => {
//   const [pot, setPot] = useState<PotFormState>({
//     volume: '',
//     culture: '',
//     windowsillId: '',
//   })

//   const [windowsills, setWindowsills] = useState<Windowsill[]>([])

//   useEffect(() => {
//     const fetchWindowsills = async () => {
//       try {
//         const res = await axios.get('/windowsills', { withCredentials: true })
//         setWindowsills(res.data)
//       } catch (err) {
//         console.error('Ошибка при загрузке подоконников:', err)
//       }
//     }

//     fetchWindowsills()
//   }, [])

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setPot({ ...pot, [name]: value })
//   }

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()

//     try {
//       await axios.post('/pots', {
//         volume: +pot.volume,
//         culture: pot.culture,
//         windowsillId: +pot.windowsillId
//       }, { withCredentials: true })

//       alert('✅ Горшок добавлен')
//       setPot({ volume: '', culture: '', windowsillId: '' })
//     } catch (err) {
//       console.error(err)
//       alert('❌ Ошибка при добавлении горшка')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
//       <h3 className="text-lg font-semibold">🪴 Добавить горшок</h3>

//       <select
//         name="windowsillId"
//         value={pot.windowsillId}
//         onChange={handleChange}
//         className="w-full border p-2 rounded"
//         required
//       >
//         <option value="">Выберите подоконник</option>
//         {windowsills.map(w => (
//           <option key={w.id} value={w.id}>
//             {`#${w.id} — ${w.side}, ${w.floor} эт.`}
//           </option>
//         ))}
//       </select>

//       <input
//         type="number"
//         name="volume"
//         placeholder="Объём (в литрах)"
//         value={pot.volume}
//         onChange={handleChange}
//         className="w-full border p-2 rounded"
//         required
//       />

//       <input
//         type="text"
//         name="culture"
//         placeholder="Культура"
//         value={pot.culture}
//         onChange={handleChange}
//         className="w-full border p-2 rounded"
//         required
//       />

//       <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
//         Добавить горшок
//       </button>
//     </form>
//   )
// }

// export default PotForm
import React, { useState, ChangeEvent, FormEvent } from 'react'
import axios from '../api/axios'

interface Props {
  windowsillId: number
}

const PotForm: React.FC<Props> = ({ windowsillId }) => {
  const [pot, setPot] = useState({
    volume: '',
    culture: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPot({ ...pot, [name]: value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await axios.post('/pots', {
        volume: +pot.volume,
        culture: pot.culture,
        windowsillId
      }, { withCredentials: true })

      alert('✅ Горшок добавлен')
      setPot({ volume: '', culture: '' })
    } catch (err) {
      console.error(err)
      alert('❌ Ошибка при добавлении горшка')
    }
  }

  if (!windowsillId) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow mt-6">
      <h3 className="text-lg font-semibold">🪴 Добавить горшок для подоконника #{windowsillId}</h3>

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
