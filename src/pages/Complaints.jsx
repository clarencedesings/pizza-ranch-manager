import { useState, useEffect } from 'react'
import api from '../api'

export default function Complaints() {
  const [items, setItems] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [text, setText] = useState('')
  const [severity, setSeverity] = useState('medium')

  const load = async () => {
    const { data } = await api.get('/complaints')
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    await api.post('/complaints', { customer_name: customerName, text, severity })
    setCustomerName('')
    setText('')
    setSeverity('medium')
    load()
  }

  const handleDelete = async (id) => {
    await api.delete(`/complaints/${id}`)
    load()
  }

  return (
    <>
      <div className="form-card">
        <h2>Log a Complaint</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Customer Name (optional)</label>
              <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Name" />
            </div>
            <div>
              <label>Severity</label>
              <select value={severity} onChange={e => setSeverity(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Complaint Details</label>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Describe the complaint..." />
          </div>
          <button className="btn btn-red" type="submit">Log Complaint</button>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">No complaints logged.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Date/Time</th><th>Customer</th><th>Complaint</th><th>Severity</th><th></th></tr>
          </thead>
          <tbody>
            {[...items].reverse().map(c => (
              <tr key={c.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{c.timestamp}</td>
                <td>{c.customer_name || '—'}</td>
                <td>{c.text}</td>
                <td><span className={`badge badge-${c.severity}`}>{c.severity}</span></td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
