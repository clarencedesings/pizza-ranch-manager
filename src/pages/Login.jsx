import { useState } from 'react'
import api from '../api'

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/login', { password })
      if (data.success) {
        onLogin()
      } else {
        setError('Invalid password')
      }
    } catch {
      setError('Connection error')
    }
  }

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>🍕 Pizza Ranch</h1>
        <p className="sub">FunZone Manager Dashboard</p>
        <input
          type="password"
          placeholder="Enter manager password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
        />
        <button className="btn btn-red" type="submit">Log In</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
