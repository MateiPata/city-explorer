import { useEffect, useState } from 'react'
import { getStatistici } from '../api/statistici'

export default function PanouStatistici() {
  const [prag, setPrag] = useState(3)
  const [tara, setTara] = useState('')
  const [date, setDate] = useState(null)

  useEffect(() => {
    if (!Number.isInteger(Number(prag)) || Number(prag) < 1) return
    getStatistici(prag, tara)
      .then(setDate)
      .catch(() => setDate(null))
  }, [prag, tara])

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, margin: '16px 0' }}>
      <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Statistici</h2>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <label>
          Cel puțin{' '}
          <input
            type="number"
            min="1"
            value={prag}
            onChange={(e) => setPrag(e.target.value)}
            style={{ width: 60 }}
          />{' '}
          zile
        </label>
        <label>
          Țara{' '}
          <input
            type="text"
            placeholder="toate"
            value={tara}
            onChange={(e) => setTara(e.target.value)}
            style={{ width: 120 }}
          />
        </label>
      </div>
      {date && (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Destinații: {date.destinatii}</li>
          <li>Total zile: {date.zile}</li>
          <li>Media: {date.medie} zile</li>
        </ul>
      )}
    </section>
  )
}