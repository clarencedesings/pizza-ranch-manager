import { useState, useEffect } from 'react'
import api from '../api'

export default function Specials() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [specials, setSpecials] = useState([])

  const load = async () => {
    const { data } = await api.get('/specials')
    setSpecials(data)
  }

  useEffect(() => { load() }, [])

  const today = new Date().toISOString().slice(0, 10)
  const todaySpecial = specials.filter(s => s.date === today).pop()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await api.post('/specials', { name, description })
    setName('')
    setDescription('')
    load()
  }

  return (
    <>
      {todaySpecial && (
        <div className="form-card" style={{ borderLeft: '4px solid #F5A800' }}>
          <h2>Current Special — {today}</h2>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#F5A800' }}>{todaySpecial.name}</p>
          <p style={{ color: '#666', marginTop: 4 }}>{todaySpecial.description}</p>
        </div>
      )}

      <div className="form-card">
        <h2>Set Today's Special</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Pizza Special Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. BBQ Chicken Ranch" />
            </div>
            <div>
              <label>Description</label>
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. BBQ sauce, chicken, bacon, ranch drizzle" />
            </div>
          </div>
          <button className="btn btn-gold" type="submit">Set Special</button>
        </form>
      </div>

      {specials.length > 0 && (
        <table className="data-table">
          <thead>
            <tr><th>Date</th><th>Special</th><th>Description</th></tr>
          </thead>
          <tbody>
            {[...specials].reverse().slice(0, 14).map((s, i) => (
              <tr key={i}>
                <td>{s.date}</td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td>{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
