import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CalendarWidget from '../components/CalendarWidget'
import FullCalendarBlock from '../components/FullCalendarBlock'

const CalendarPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">📅 Календарь фермера</h2>
        <CalendarWidget hideLink />
        <FullCalendarBlock />
      </main>
      <Footer />
    </>
  )
}

export default CalendarPage
