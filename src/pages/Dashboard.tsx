import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DashboardStats from '../components/DashboardStats'
import QuickActions from '../components/QuickActions'
import RecentActivity from '../components/RecentActivity'
import ActiveCropsTable from '../components/ActiveCropsTable'
import CropRecommendationModal from '../components/CropRecommendationModal'
import CalendarWidget from '../components/CalendarWidget'

const Dashboard: React.FC = () => {
  const [showRecommend, setShowRecommend] = useState(false)

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">👤 Личный кабинет</h2>

        <DashboardStats />
        <QuickActions onRecommendOpen={() => setShowRecommend(true)} />
        <CalendarWidget />
        <RecentActivity />
        <ActiveCropsTable />
      </main>
      <Footer />

      <CropRecommendationModal
        isOpen={showRecommend}
        onClose={() => setShowRecommend(false)}
      />
    </>
  )
}

export default Dashboard
