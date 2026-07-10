
import { Navigate, Route, Routes } from 'react-router-dom'
import Entrance from '../pages/Entrance'
import DashBoard from '../pages/DashBoard'
import Invoices from '../pages/Invoices'
import NotFound from '../pages/NotFound'


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Entrance />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/app" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

