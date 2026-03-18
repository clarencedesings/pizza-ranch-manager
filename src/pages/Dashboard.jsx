import { useState, useEffect } from 'react'
import api from '../api'

export default function Dashboard() {
  const [data, setData] = useState({
    special: null,
    complaints: 0,
    parties: 0,
    shifts: 0,
    lowInventory: 0,
    announcements: [],
  })

  useEffect(() => {
    async function load() {
      const [sp, co, pa, sh, inv, an] = await Promise.all([
        api.get('/specials'),
        api.get('/complaints'),
        api.get('/parties'),
        api.get('/shifts'),
        api.get('/inventory'),
        api.get('/announcements'),
      ])
      const today = new Date().toISOString().slice(0, 10)
      const todaySpecial = sp.data.filter(s => s.date === today).pop()
      const lowKeywords = /low|reorder|out of stock|empty/i
      const unchecked = inv.data.filter(i => i.notes && lowKeywords.test(i.notes)).length
      const openShifts = sh.data.filter(s => !s.claimed_by).length
      const urgent = an.data.filter(a => a.priority === 'urgent').slice(-3)
      setData({
        special: todaySpecial,
        complaints: co.data.length,
        parties: pa.data.length,
        shifts: openShifts,
        lowInventory: unchecked,
        announcements: urgent,
      })
    }
    load()
  }, [])

  return (
    <>
      <div className="card-grid">
        <div className="card">
          <h3>Today's Special</h3>
          <div className="value gold">{data.special ? data.special.name : 'Not Set'}</div>
          {data.special && <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{data.special.description}</p>}
        </div>
        <div className="card">
          <h3>Complaints</h3>
          <div className={`value ${data.complaints > 0 ? 'red' : ''}`}>{data.complaints}</div>
        </div>
        <div className="card">
          <h3>Upcoming Parties</h3>
          <div className="value">{data.parties}</div>
        </div>
        <div className="card">
          <h3>Open Shifts</h3>
          <div className={`value ${data.shifts > 0 ? 'red' : ''}`}>{data.shifts}</div>
        </div>
        <div className="card">
          <h3>Low Inventory</h3>
          <div className={`value ${data.lowInventory > 0 ? 'red' : ''}`}>{data.lowInventory}</div>
        </div>
      </div>

      {data.announcements.length > 0 && (
        <div className="form-card">
          <h2>Urgent Announcements</h2>
          {data.announcements.map((a, i) => (
            <div key={i} className="announcement-card urgent">
              <h3>{a.title}</h3>
              <p>{a.message}</p>
              <div className="meta">{a.timestamp}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
