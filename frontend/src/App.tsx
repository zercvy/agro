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
import EditPlotPage from './pages/EditPlotPage';
import PrivateRoute from './components/PrivateRoute'
//  Admin
import AdminRoute from './components/admin/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import CreateAdmin from './pages/admin/CreateAdmin';
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* 🔐 Защищённые маршруты */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/create-plot" element={<PrivateRoute><CreatePlot /></PrivateRoute>} />
      <Route path="/plots" element={<PrivateRoute><PlotListPage /></PrivateRoute>} />
      <Route path="/plots/:id" element={<PrivateRoute><PlotDetailsPage /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
      <Route path="/windowsills" element={<PrivateRoute><WindowsillPage /></PrivateRoute>} />
      <Route path="/plots/edit/:id" element={<PrivateRoute><EditPlotPage /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/create" element={<AdminRoute><CreateAdmin /></AdminRoute>} />

      {/* 🟢 Открытые маршруты */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/cultures" element={<CulturePage />} />
      <Route path="/fertilizer" element={<FertilizerPage />} />
    </Routes>
  )
}

export default App
