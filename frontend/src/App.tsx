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
import MyCulturesPage from './pages/MyCulturesPage';
import VerifyPage from './pages/VerifyPage'
// Admin
import AdminRoute from './components/admin/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import CreateAdmin from './pages/admin/CreateAdmin';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEditPage from './pages/admin/AdminEditPage'; // Страница редактирования админа
import UserEditPage from './pages/admin/UserEditPage'; // Страница редактирования пользователя
import Header from './components/Header';
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
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/create" element={<AdminRoute><CreateAdmin /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/users/:userId" element={<AdminRoute><UserEditPage /></AdminRoute>} />
      <Route path="/admin/admins/:adminId" element={<AdminRoute><AdminEditPage /></AdminRoute>} />


      {/* 🟢 Открытые маршруты */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/cultures" element={<CulturePage />} />
      <Route path="/my-cultures" element={<MyCulturesPage />} />
      <Route path="/fertilizer" element={<FertilizerPage />} />

      <Route path="/verify" element={<VerifyPage />} />

    </Routes>
  )
}

export default App
