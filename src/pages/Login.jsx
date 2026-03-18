import { useState } from 'react'
import api from '../api'

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/login', { password, username })
      if (data.success) {
        if (data.role !== selectedRole) {
          setError('Invalid password for selected role')
          return
        }
        console.log('[Login] Success, role:', data.role, 'name:', data.name)
        onLogin(data.role)
      } else {
        setError('Invalid password for selected role')
      }
    } catch {
      setError('Connection error')
    }
  }

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value)
    setUsername('')
    setPassword('')
    setError('')
  }

  const canSubmit = selectedRole && password && (selectedRole === 'manager' || username)

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>🍕 Pizza Ranch</h1>
        <p className="sub">FunZone Manager Dashboard</p>
        <select
          value={selectedRole}
          onChange={handleRoleChange}
          style={{ marginBottom: 16, textAlign: 'center', fontSize: 16, padding: 14 }}
        >
          <option value="">Select your role...</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
        {selectedRole === 'staff' && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
        )}
        {selectedRole && (
          <input
            type="password"
            placeholder={`Enter ${selectedRole} password`}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus={selectedRole === 'manager'}
          />
        )}
        <button className="btn btn-red" type="submit" disabled={!canSubmit}>Log In</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
