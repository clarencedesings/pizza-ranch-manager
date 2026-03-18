import { useState, useEffect } from 'react'
import api from '../api'

const DEFAULT_ITEMS = [
  'Dough', 'Mozzarella', 'Sauce', 'Pepperoni', 'Chicken',
  'Tokens', 'Prize Inventory', 'Napkins', 'Cups', 'Plates',
]

export default function Inventory() {
  const [items, setItems] = useState([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/inventory')
      if (data.length === 0) {
        setItems(DEFAULT_ITEMS.map(name => ({ name, checked: false, notes: '' })))
      } else {
        setItems(data)
      }
    }
    load()
  }, [])

  const toggle = (idx) => {
    const next = [...items]
    next[idx] = { ...next[idx], checked: !next[idx].checked }
    setItems(next)
    setSaved(false)
  }

  const updateNotes = (idx, notes) => {
    const next = [...items]
    next[idx] = { ...next[idx], notes }
    setItems(next)
    setSaved(false)
  }

  const handleSave = async () => {
    await api.post('/inventory', { items })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const checkedCount = items.filter(i => i.checked).length

  return (
    <>
      <div className="form-card">
        <h2>Inventory Status: {checkedCount}/{items.length} items stocked</h2>
        <div className="inventory-list">
          {items.map((item, idx) => (
            <div key={idx} className="inventory-item">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggle(idx)}
              />
              <span className="item-name" style={{ color: /low|reorder|out of stock|empty/i.test(item.notes) ? '#e67e00' : item.checked ? '#28a745' : '#C8102E' }}>
                {/low|reorder|out of stock|empty/i.test(item.notes) && '\u26A0\uFE0F '}{item.name}
              </span>
              <input
                type="text"
                placeholder="Notes (e.g. running low, reorder)"
                value={item.notes}
                onChange={e => updateNotes(idx, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-gold" onClick={handleSave}>Save Inventory</button>
          {saved && <span style={{ color: '#28a745', fontSize: 14 }}>Saved!</span>}
        </div>
      </div>
    </>
  )
}
