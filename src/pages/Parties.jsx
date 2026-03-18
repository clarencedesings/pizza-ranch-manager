import { useState, useEffect } from 'react'
import api from '../api'

export default function Parties() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    contact_name: '', phone: '', date: '', time: '',
    guest_count: '', deposit_paid: false, special_requests: '',
  })

  const load = async () => {
    const { data } = await api.get('/parties')
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const set = (k, v) => setForm({ ...form, [k]: v })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.contact_name || !form.date) return
    await api.post('/parties', {
      ...form,
      guest_count: parseInt(form.guest_count) || 0,
    })
    setForm({ contact_name: '', phone: '', date: '', time: '', guest_count: '', deposit_paid: false, special_requests: '' })
    load()
  }

  const handleDelete = async (id) => {
    await api.delete(`/parties/${id}`)
    load()
  }

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <div className="form-card">
        <h2>Add Party Booking</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Contact Name</label>
              <input value={form.contact_name} onChange={e => set('contact_name', e.target.value)} placeholder="Name" />
            </div>
            <div>
              <label>Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(620) 555-1234" />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label>Time</label>
              <input type="time" value={form.time} onChange={e => set('time', e.target.value)} />
            </div>
            <div>
              <label>Guest Count</label>
              <input type="number" value={form.guest_count} onChange={e => set('guest_count', e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="form-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox" checked={form.deposit_paid}
                onChange={e => set('deposit_paid', e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#C8102E' }}
              />
              <span style={{ fontSize: 14 }}>Deposit Paid</span>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Special Requests</label>
            <textarea value={form.special_requests} onChange={e => set('special_requests', e.target.value)} placeholder="Any special requests..." />
          </div>
          <button className="btn btn-gold" type="submit">Add Party</button>
        </form>
      </div>

      {sorted.length === 0 ? (
        <p className="empty-state">No parties booked.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Date</th><th>Time</th><th>Contact</th><th>Phone</th><th>Guests</th><th>Deposit</th><th>Requests</th><th></th></tr>
          </thead>
          <tbody>
            {sorted.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.date}</td>
                <td>{p.time}</td>
                <td>{p.contact_name}</td>
                <td>{p.phone}</td>
                <td>{p.guest_count}</td>
                <td><span className={`badge ${p.deposit_paid ? 'badge-paid' : 'badge-unpaid'}`}>{p.deposit_paid ? 'Paid' : 'Unpaid'}</span></td>
                <td>{p.special_requests || '—'}</td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
