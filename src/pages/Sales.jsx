import { useState, useEffect } from 'react'
import api from '../api'

const fmtUSD = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function MoneyInput({ label, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false)

  const displayed = focused
    ? value
    : value ? '$' + fmtUSD(value) : ''

  const handleChange = (e) => {
    onChange(e.target.value.replace(/[^0-9.]/g, ''))
  }

  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        inputMode="decimal"
        value={displayed}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
      />
    </div>
  )
}

const EMPTY_FORM = { covers_served: '', buffet_revenue: '', arcade_revenue: '', notes: '' }

export default function Sales() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)

  const load = async () => {
    const { data } = await api.get('/sales')
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const set = (k, v) => setForm({ ...form, [k]: v })

  const payload = () => ({
    covers_served: parseInt(form.covers_served) || 0,
    buffet_revenue: parseFloat(form.buffet_revenue) || 0,
    arcade_revenue: parseFloat(form.arcade_revenue) || 0,
    notes: form.notes,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = payload()
    if (editId) {
      console.log('[Sales] Updating entry:', editId, data)
      const res = await api.put(`/sales/${editId}`, data)
      console.log('[Sales] PUT response:', res.status, res.data)
      setEditId(null)
    } else {
      console.log('[Sales] Creating entry:', data)
      const res = await api.post('/sales', data)
      console.log('[Sales] POST response:', res.status, res.data)
    }
    setForm(EMPTY_FORM)
    load()
  }

  const handleEdit = (s) => {
    setEditId(s.id)
    setForm({
      covers_served: String(s.covers_served),
      buffet_revenue: String(s.buffet_revenue),
      arcade_revenue: String(s.arcade_revenue),
      notes: s.notes || '',
    })
  }

  const handleCancel = () => {
    setEditId(null)
    setForm(EMPTY_FORM)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sales entry?')) return
    await api.delete(`/sales/${id}`)
    if (editId === id) handleCancel()
    load()
  }

  return (
    <>
      <div className="form-card">
        <h2>{editId ? 'Edit Sales Entry' : 'Enter End of Day Sales'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Covers Served</label>
              <input type="number" value={form.covers_served} onChange={e => set('covers_served', e.target.value)} placeholder="0" />
            </div>
            <MoneyInput
              label="Buffet Revenue ($)"
              value={form.buffet_revenue}
              onChange={v => set('buffet_revenue', v)}
              placeholder="$0.00"
            />
            <MoneyInput
              label="Arcade Revenue ($)"
              value={form.arcade_revenue}
              onChange={v => set('arcade_revenue', v)}
              placeholder="$0.00"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any notes about today..." />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-gold" type="submit">{editId ? 'Update Entry' : 'Save Sales Entry'}</button>
            {editId && <button className="btn btn-sm btn-danger" type="button" onClick={handleCancel}>Cancel</button>}
          </div>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">No sales entries yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Date</th><th>Covers</th><th>Buffet Rev</th><th>Arcade Rev</th><th>Total</th><th>Notes</th><th></th></tr>
          </thead>
          <tbody>
            {[...items].reverse().map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.date}</td>
                <td>{s.covers_served}</td>
                <td>${fmtUSD(s.buffet_revenue)}</td>
                <td>${fmtUSD(s.arcade_revenue)}</td>
                <td style={{ fontWeight: 700, color: '#F5A800' }}>${fmtUSD(s.buffet_revenue + s.arcade_revenue)}</td>
                <td>{s.notes || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-sm btn-gold" onClick={() => handleEdit(s)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
