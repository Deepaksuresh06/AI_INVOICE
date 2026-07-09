
import { BrowserRouter } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PremiumAppShell from './components/layout/PremiumAppShell'
import AppRoutes from './routes/AppRoutes'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <PremiumAppShell>
        <AnimatePresence mode="wait">
          <AppRoutes />
        </AnimatePresence>
      </PremiumAppShell>
    </BrowserRouter>
  )
}

