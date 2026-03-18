import { useState, useEffect } from 'react'
import api from '../api'

export default function Announcements() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('normal')

  const load = async () => {
    const { data } = await api.get('/announcements')
    setItems(data)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return
    await api.post('/announcements', { title, message, priority })
    setTitle('')
    setMessage('')
    setPriority('normal')
    load()
  }

  return (
    <>
      <div className="form-card">
        <h2>Post Announcement</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title" />
            </div>
            <div>
              <label>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type announcement..." />
          </div>
          <button className="btn btn-red" type="submit">Post Announcement</button>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="empty-state">No announcements yet.</p>
      ) : (
        [...items].reverse().map(a => (
          <div key={a.id} className={`announcement-card ${a.priority === 'urgent' ? 'urgent' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3>{a.title}</h3>
              <span className={`badge badge-${a.priority}`}>{a.priority}</span>
            </div>
            <p>{a.message}</p>
            <div className="meta">{a.timestamp}</div>
          </div>
        ))
      )}
    </>
  )
}
