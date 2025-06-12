import React from 'react'
import Header from '../components/Header'
import WeatherBlock from '../components/weather/WeatherBlock'
import AboutBlock from '../components/AboutBlock'
import Footer from '../components/Footer'
import AboutUsBlock from '../components/AboutUsBlock'
import CalendarWidget from '../components/CalendarWidget'
import BasicFertilizerCalculator from '../components/BasicFertilizerCalculator'

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <WeatherBlock />
        <CalendarWidget />
        <AboutBlock />
        <AboutUsBlock />
        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">🧪 Быстрый расчёт удобрений</h2>
          <BasicFertilizerCalculator />
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Home
