import { useState, useEffect } from 'react'
import api from '../api'

export default function Sales() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    covers_served: '', buffet_revenue: '', arcade_revenue: '', notes: '',
  })

  const load = async () => {
    const { data } = await api.get('/sales')
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const set = (k, v) => setForm({ ...form, [k]: v })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/sales', {
      covers_served: parseInt(form.covers_served) || 0,
      buffet_revenue: parseFloat(form.buffet_revenue) || 0,
      arcade_revenue: parseFloat(form.arcade_revenue) || 0,
      notes: form.notes,
    })
    setForm({ covers_served: '', buffet_revenue: '', arcade_revenue: '', notes: '' })
    load()
  }

  return (
    <>
      <div className="form-card">
        <h2>Enter End of Day Sales</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Covers Served</label>
              <input type="number" value={form.covers_served} onChange={e => set('covers_served', e.target.value)} placeholder="0" />
            </div>
            <div>
              <label>Buffet Revenue ($)</label>
              <input type="number" step="0.01" value={form.buffet_revenue} onChange={e => set('buffet_revenue', e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <label>Arcade Revenue ($)</label>
              <input type="number" step="0.01" value={form.arcade_revenue} onChange={e => set('arcade_revenue', e.target.value)} placeholder="0.00" />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any notes about today..." />
          </div>
          <button className="btn btn-gold" type="submit">Save Sales Entry</button>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">No sales entries yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Date</th><th>Covers</th><th>Buffet Rev</th><th>Arcade Rev</th><th>Total</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {[...items].reverse().map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.date}</td>
                <td>{s.covers_served}</td>
                <td>${s.buffet_revenue.toFixed(2)}</td>
                <td>${s.arcade_revenue.toFixed(2)}</td>
                <td style={{ fontWeight: 700, color: '#F5A800' }}>${(s.buffet_revenue + s.arcade_revenue).toFixed(2)}</td>
                <td>{s.notes || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
