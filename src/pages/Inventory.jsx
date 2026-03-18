import { useState, useEffect } from 'react'
import api from '../api'

const DEFAULT_ITEMS = [
  'Dough', 'Mozzarella', 'Sauce', 'Pepperoni', 'Chicken',
  'Tokens', 'Prize Inventory', 'Napkins', 'Cups', 'Plates',
]

export default function Inventory() {
  const [items, setItems] = useState([])
  const [saved, setSaved] = useState(false)
  const [newItem, setNewItem] = useState('')

  const load = async () => {
    const { data } = await api.get('/inventory')
    if (data.length === 0) {
      setItems(DEFAULT_ITEMS.map(name => ({ name, checked: false, notes: '' })))
    } else {
      setItems(data)
    }
  }

  useEffect(() => { load() }, [])

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

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newItem.trim()) return
    await api.post('/inventory/add', { name: newItem.trim() })
    setNewItem('')
    load()
  }

  const handleDelete = async (name) => {
    if (!window.confirm(`Remove "${name}" from inventory?`)) return
    await api.delete(`/inventory/${encodeURIComponent(name)}`)
    load()
  }

  const checkedCount = items.filter(i => i.checked).length

  return (
    <>
      <div className="form-card">
        <h2>Inventory Status: {checkedCount}/{items.length} items stocked</h2>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            placeholder="New item name..."
            style={{ flex: 1 }}
          />
          <button className="btn btn-gold" type="submit">Add Item</button>
        </form>
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
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(item.name)}
                title="Remove item"
                style={{ flexShrink: 0, padding: '6px 10px' }}
              >✕</button>
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
