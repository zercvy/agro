// /pages/CulturePage.tsx

import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CultureTable from '../components/CultureTable'
import Breadcrumbs from '../components/Breadcrumbs';
const CulturePage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumbs />
        <h2 className="text-2xl font-bold mb-6">🌱 База культур</h2>
        <CultureTable />
      </main>
      <Footer />
    </>
  )
}

export default CulturePage
