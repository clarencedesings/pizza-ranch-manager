import { useState, useEffect } from 'react'
import api from '../api'

export default function Staff() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState({ name: '', username: '', password: '' })
  const [resetId, setResetId] = useState(null)
  const [newPassword, setNewPassword] = useState('')

  const load = async () => {
    const { data } = await api.get('/staff')
    setAccounts(data)
  }

  useEffect(() => { load() }, [])

  const set = (k, v) => setForm({ ...form, [k]: v })

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) return
    await api.post('/staff', form)
    setForm({ name: '', username: '', password: '' })
    load()
  }

  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Deactivate account for "${name}"?`)) return
    await api.delete(`/staff/${id}`)
    load()
  }

  const handleResetPassword = async (id) => {
    if (!newPassword.trim()) return
    await api.put(`/staff/${id}/reset-password`, { new_password: newPassword })
    setResetId(null)
    setNewPassword('')
    load()
  }

  return (
    <>
      <div className="form-card">
        <h2>Add Staff Account</h2>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div>
              <label>Full Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Smith" />
            </div>
            <div>
              <label>Username</label>
              <input value={form.username} onChange={e => set('username', e.target.value)} placeholder="jsmith" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Password" />
            </div>
          </div>
          <button className="btn btn-gold" type="submit">Add Staff</button>
        </form>
      </div>

      {accounts.length === 0 ? (
        <p className="empty-state">No staff accounts created yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Username</th><th>Created</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.name}</td>
                <td>{a.username}</td>
                <td>{a.created_at}</td>
                <td>
                  <span className={`badge ${a.active ? 'badge-claimed' : 'badge-high'}`}>
                    {a.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  {resetId === a.id ? (
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <input
                        style={{ width: 140, padding: '4px 8px', fontSize: 12 }}
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                      <button className="btn btn-sm btn-success" onClick={() => handleResetPassword(a.id)}>Save</button>
                      <button className="btn btn-sm btn-danger" onClick={() => { setResetId(null); setNewPassword('') }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-sm btn-gold" onClick={() => setResetId(a.id)}>Reset Password</button>
                      {a.active && (
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeactivate(a.id, a.name)}>Deactivate</button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
