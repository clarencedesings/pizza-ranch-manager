import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Specials from './pages/Specials'
import Inventory from './pages/Inventory'
import Complaints from './pages/Complaints'
import Parties from './pages/Parties'
import Sales from './pages/Sales'
import Announcements from './pages/Announcements'
import Shifts from './pages/Shifts'
import Staff from './pages/Staff'
import ShiftsPublic from './pages/ShiftsPublic'

function AuthedApp({ auth, onLogout }) {
  const { role } = auth
  console.log('[App] Rendering with role:', role)

  const staffDefault = '/inventory'
  const managerOnly = (element) =>
    role === 'manager' ? element : <Navigate to={staffDefault} />

  return (
    <Layout role={role} onLogout={onLogout}>
      <Routes>
        <Route path="/" element={managerOnly(<Dashboard />)} />
        <Route path="/specials" element={managerOnly(<Specials />)} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/complaints" element={managerOnly(<Complaints />)} />
        <Route path="/parties" element={managerOnly(<Parties />)} />
        <Route path="/sales" element={managerOnly(<Sales />)} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/shifts" element={<Shifts />} />
        <Route path="/staff" element={managerOnly(<Staff />)} />
        <Route path="*" element={<Navigate to={role === 'manager' ? '/' : staffDefault} />} />
      </Routes>
    </Layout>
  )
}

function App() {
  const [auth, setAuth] = useState({ loggedIn: false, role: null })
  const location = useLocation()

  const handleLogin = (r) => {
    console.log('[App] Login with role:', r)
    setAuth({ loggedIn: true, role: r })
  }

  const handleLogout = () => {
    setAuth({ loggedIn: false, role: null })
  }

  // Public route — no auth required
  if (location.pathname === '/shifts-public') {
    return <ShiftsPublic />
  }

  if (!auth.loggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return <AuthedApp auth={auth} onLogout={handleLogout} />
}

export default App
