import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PlotInfoBlock from '../components/PlotInfoBlock'
import PlotCropList from '../components/PlotCropList'
import PlotMap from '../components/PlotMap'
import { useParams } from 'react-router-dom'

interface Plot {
  id: number
  name: string
  area: number
  soil: string
  lightBarriers: string
  windBarriers: string
  crops: string[]
  description?: string
}

const samplePlot: Plot = {
  id: 1,
  name: 'Южная грядка',
  area: 25,
  soil: 'Суглинок',
  lightBarriers: 'Забор 1.5 м',
  windBarriers: 'Кустарник 2 м',
  crops: ['Томат', 'Базилик'],
  description: 'Основной летний участок'
}

const PlotDetailsPage: React.FC = () => {
  const { id } = useParams()
  const plot = samplePlot // заглушка

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <h2 className="text-2xl font-bold">📍 {plot.name}</h2>
        <PlotInfoBlock plot={plot} />
        <PlotCropList crops={plot.crops} />
        <PlotMap />
      </main>
      <Footer />
    </>
  )
}

export default PlotDetailsPage
