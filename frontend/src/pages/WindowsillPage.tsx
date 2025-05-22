import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WindowsillForm from '../components/WindowsillForm'
import PotForm from '../components/PotForm'
import PotTable from '../components/PotTable'

const WindowsillPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">🪟 Подоконники и горшки</h2>
        <WindowsillForm />
        <hr className="my-8" />
        <PotForm />
        <PotTable />
      </main>
      <Footer />
    </>
  )
}

export default WindowsillPage
