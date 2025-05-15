import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PlotForm from '../components/PlotForm'

const CreatePlot = () => {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">📍 Создание участка</h2>
        <PlotForm />
      </main>
      <Footer />
    </>
  )
}

export default CreatePlot
