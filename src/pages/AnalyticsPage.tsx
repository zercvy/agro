import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import YieldChart from '../components/YieldChart'
import SoilChart from '../components/SoilChart'
import CropRotationList from '../components/CropRotationList'

const AnalyticsPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <h2 className="text-2xl font-bold">📈 Аналитика участка</h2>
        <YieldChart />
        <SoilChart />
        <CropRotationList />
      </main>
      <Footer />
    </>
  )
}

export default AnalyticsPage
