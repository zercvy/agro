import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PlotCard from '../components/PlotCard'

interface Plot {
  id: number
  name: string
  soil: string
  area: number
  crops: string[]
}

const plots: Plot[] = [
  {
    id: 1,
    name: 'Южная грядка',
    soil: 'Суглинок',
    area: 25,
    crops: ['Томат', 'Базилик']
  },
  {
    id: 2,
    name: 'Теплица №1',
    soil: 'Чернозём',
    area: 40,
    crops: ['Огурец', 'Салат']
  }
]

const PlotListPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-bold mb-4">🌿 Мои участки</h2>
        {plots.map(plot => (
          <PlotCard key={plot.id} plot={plot} />
        ))}
      </main>
      <Footer />
    </>
  )
}

export default PlotListPage
