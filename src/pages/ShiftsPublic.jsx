import { useState, useEffect } from 'react'
import api from '../api'

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f0f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  header: {
    background: '#C8102E',
    color: '#fff',
    padding: '24px 20px',
    textAlign: 'center',
  },
  headerIcon: { fontSize: 32, marginBottom: 4 },
  headerTitle: { fontSize: 22, fontWeight: 700, margin: '4px 0' },
  headerSub: { fontSize: 13, opacity: 0.8 },
  body: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '24px 16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  cardDate: { fontSize: 13, color: '#888', marginBottom: 4 },
  cardPosition: { fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 },
  cardTime: { fontSize: 15, color: '#444', marginBottom: 4 },
  cardNotes: { fontSize: 13, color: '#666', fontStyle: 'italic', marginBottom: 12 },
  claimBtn: {
    background: '#F5A800',
    color: '#1a1a1a',
    border: 'none',
    borderRadius: 8,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  claimRow: { display: 'flex', gap: 8, alignItems: 'center' },
  claimInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
  },
  confirmBtn: {
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  cancelBtn: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  claimed: {
    color: '#28a745',
    fontWeight: 600,
    fontSize: 14,
  },
  empty: {
    textAlign: 'center',
    padding: 60,
    color: '#888',
    fontSize: 16,
  },
  footer: {
    textAlign: 'center',
    padding: '32px 16px',
    color: '#aaa',
    fontSize: 13,
  },
}

function ShiftCard({ shift, onClaim }) {
  const [claiming, setClaiming] = useState(false)
  const [name, setName] = useState('')

  const handleConfirm = () => {
    if (!name.trim()) return
    onClaim(shift.id, name.trim())
    setClaiming(false)
    setName('')
  }

  if (shift.claimed_by) {
    return (
      <div style={styles.card}>
        <div style={styles.cardDate}>{shift.date}</div>
        <div style={styles.cardPosition}>{shift.position}</div>
        <div style={styles.cardTime}>{shift.time}</div>
        {shift.notes && <div style={styles.cardNotes}>{shift.notes}</div>}
        <div style={styles.claimed}>✅ Claimed by {shift.claimed_by}</div>
      </div>
    )
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardDate}>{shift.date}</div>
      <div style={styles.cardPosition}>{shift.position}</div>
      <div style={styles.cardTime}>{shift.time}</div>
      {shift.notes && <div style={styles.cardNotes}>{shift.notes}</div>}
      {claiming ? (
        <div style={styles.claimRow}>
          <input
            style={styles.claimInput}
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          <button style={styles.confirmBtn} onClick={handleConfirm}>Confirm</button>
          <button style={styles.cancelBtn} onClick={() => { setClaiming(false); setName('') }}>✕</button>
        </div>
      ) : (
        <button style={styles.claimBtn} onClick={() => setClaiming(true)}>Claim This Shift</button>
      )}
    </div>
  )
}

export default function ShiftsPublic() {
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const { data } = await api.get('/shifts')
      setShifts(data.filter(s => !s.claimed_by).sort((a, b) => a.date.localeCompare(b.date)))
    } catch {
      console.error('Failed to load shifts')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleClaim = async (id, name) => {
    await api.put(`/shifts/${id}/claim`, { claimed_by: name })
    load()
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>🍕</div>
        <div style={styles.headerTitle}>Open Shifts Board</div>
        <div style={styles.headerSub}>Pizza Ranch FunZone — McPherson, KS</div>
      </div>
      <div style={styles.body}>
        {loading ? (
          <div style={styles.empty}>Loading shifts...</div>
        ) : shifts.length === 0 ? (
          <div style={styles.empty}>No open shifts right now. Check back later!</div>
        ) : (
          <div style={styles.grid}>
            {shifts.map(s => (
              <ShiftCard key={s.id} shift={s} onClaim={handleClaim} />
            ))}
          </div>
        )}
      </div>
      <div style={styles.footer}>Pizza Ranch FunZone — McPherson, KS</div>
    </div>
  )
}
