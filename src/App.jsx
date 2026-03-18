import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

function App() {
  const [authed, setAuthed] = useState(false)

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />
  }

  return (
    <Layout onLogout={() => setAuthed(false)}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/specials" element={<Specials />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/parties" element={<Parties />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/shifts" element={<Shifts />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}

export default App
