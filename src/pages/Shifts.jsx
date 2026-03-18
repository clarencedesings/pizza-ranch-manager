import { useState, useEffect } from 'react'
import api from '../api'

export default function Shifts() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ date: '', time: '', position: '', notes: '' })
  const [claimName, setClaimName] = useState({})

  const load = async () => {
    const { data } = await api.get('/shifts')
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const set = (k, v) => setForm({ ...form, [k]: v })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.date || !form.position) return
    await api.post('/shifts', form)
    setForm({ date: '', time: '', position: '', notes: '' })
    load()
  }

  const handleClaim = async (id) => {
    const name = claimName[id]
    if (!name?.trim()) return
    await api.put(`/shifts/${id}/claim`, { claimed_by: name })
    setClaimName({ ...claimName, [id]: '' })
    load()
  }

  const handleDelete = async (id) => {
    await api.delete(`/shifts/${id}`)
    load()
  }

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <div className="form-card">
        <h2>Post Open Shift</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label>Time</label>
              <input value={form.time} onChange={e => set('time', e.target.value)} placeholder="e.g. 11AM-3PM" />
            </div>
            <div>
              <label>Position</label>
              <input value={form.position} onChange={e => set('position', e.target.value)} placeholder="e.g. Buffet Attendant" />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any details..." />
          </div>
          <button className="btn btn-gold" type="submit">Post Shift</button>
        </form>
      </div>

      {sorted.length === 0 ? (
        <p className="empty-state">No open shifts.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Date</th><th>Time</th><th>Position</th><th>Notes</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {sorted.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.date}</td>
                <td>{s.time}</td>
                <td>{s.position}</td>
                <td>{s.notes || '—'}</td>
                <td>
                  {s.claimed_by ? (
                    <span className="badge badge-claimed">Claimed: {s.claimed_by}</span>
                  ) : (
                    <span className="badge badge-open">Open</span>
                  )}
                </td>
                <td>
                  {!s.claimed_by && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <input
                        style={{ width: 120, padding: '4px 8px', fontSize: 12 }}
                        placeholder="Your name"
                        value={claimName[s.id] || ''}
                        onChange={e => setClaimName({ ...claimName, [s.id]: e.target.value })}
                      />
                      <button className="btn btn-sm btn-success" onClick={() => handleClaim(s.id)}>Claim</button>
                    </div>
                  )}
                  <button className="btn btn-sm btn-danger" style={{ marginTop: 4 }} onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
