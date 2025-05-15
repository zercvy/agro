import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CreatePlot from './pages/CreatePlot'
import CalendarPage from './pages/CalendarPage'
import WindowsillPage from './pages/WindowsillPage'
import CulturePage from './pages/CulturePage'
import FertilizerPage from './pages/FertilizerPage'
import AnalyticsPage from './pages/AnalyticsPage'
import PlotListPage from './pages/PlotListPage'
import PlotDetailsPage from './pages/PlotDetailsPage'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-plot" element={<CreatePlot />} />
      <Route path="/calendar" element={<CalendarPage />} /> 
      <Route path="/windowsills" element={<WindowsillPage />} />
      <Route path="/cultures" element={<CulturePage />} />
      <Route path="/fertilizer" element={<FertilizerPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/plots" element={<PlotListPage />} />
      <Route path="/plots/:id" element={<PlotDetailsPage />} />
    </Routes>
  )
}

export default App
