import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const NAV = [
  { to: '/', icon: '📊', label: 'Dashboard', manager: true },
  { to: '/specials', icon: '🍕', label: 'Daily Specials', manager: true },
  { to: '/inventory', icon: '📦', label: 'Inventory' },
  { to: '/complaints', icon: '📋', label: 'Complaints', manager: true },
  { to: '/parties', icon: '🎉', label: 'Party Bookings', manager: true },
  { to: '/sales', icon: '💰', label: 'Daily Sales', manager: true },
  { to: '/announcements', icon: '📢', label: 'Announcements' },
  { to: '/shifts', icon: '🕐', label: 'Shift Coverage' },
]

const TITLES = {
  '/': 'Dashboard',
  '/specials': 'Daily Specials',
  '/inventory': 'Inventory Checklist',
  '/complaints': 'Complaint Log',
  '/parties': 'Party Booking Tracker',
  '/sales': 'Daily Sales Summary',
  '/announcements': 'Staff Announcements',
  '/shifts': 'Shift Coverage',
}

export default function Layout({ children, role, onLogout }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const title = TITLES[location.pathname] || 'Dashboard'
  const visibleNav = NAV.filter(n => !n.manager || role === 'manager')
  const roleLabel = role === 'manager' ? 'Manager' : 'Staff'
  console.log('[Layout] role:', role, 'visibleNav:', visibleNav.map(n => n.label))

  return (
    <div className="app-layout">
      <div className={`sidebar-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <nav className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h2>🍕 Pizza Ranch</h2>
          <span>FunZone {roleLabel}</span>
        </div>
        <div className="sidebar-nav">
          {visibleNav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              <span className="icon">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="main-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="hamburger" onClick={() => setOpen(!open)}>☰</button>
            <h1>{title}</h1>
          </div>
          <div className="status">
            {roleLabel} logged in &nbsp;
            <button className="btn btn-sm btn-red" onClick={onLogout}>Logout</button>
          </div>
        </div>
        <div className="page-body">
          {children}
        </div>
      </div>
    </div>
  )
}
