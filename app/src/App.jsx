import { useEffect, useState } from 'react'
import PanouStatistici from './components/PanouStatistici'
import {
  getDestinatii,
  postDestinatie,
  patchVizitat,
} from './api/destinatii.js'
import { getNevizitate, totalZile } from './utils/destinatii.js'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import Rezumat from './components/Rezumat.jsx'
import Cautare from './components/Cautare.jsx'
import './App.css'

export default function App() {
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  const [seTrimite, setSeTrimite] = useState(false)
  const [cautare, setCautare] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPagini, setTotalPagini] = useState(1)

  useEffect(() => {
    async function incarca() {
      setIncarcare(true)
      try {
        const rezultat = await getDestinatii(pagina)
        const lista = Array.isArray(rezultat) ? rezultat : rezultat.data
        setDestinatii(lista)
        setTotalPagini(rezultat.pages ?? 1)
      } catch (err) {
        setEroare(err.message)
      } finally {
        setIncarcare(false)
      }
    }

    incarca()
  }, [pagina])

  async function handleToggle(id) {
    const tinta = destinatii.find((d) => d.id === id)
    if (!tinta) return

    const salvata = await patchVizitat(id, !tinta.vizitat)
    setDestinatii((curent) =>
      curent.map((d) => (d.id === id ? salvata : d))
    )
  }

  async function handleAdd(nouaDestinatie) {
    setSeTrimite(true)
    try {
      const salvata = await postDestinatie(nouaDestinatie)
      setDestinatii((curent) => [...curent, salvata])
    } finally {
      setSeTrimite(false)
    }
  }

  const nevizitate = getNevizitate(destinatii)
  const text = cautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) =>
      d.oras.toLowerCase().includes(text) ||
      d.tara.toLowerCase().includes(text)
  )

  return (
    <main>
      <h1>City Explorer</h1>

      {incarcare && <p className="stare">Se încarcă destinațiile...</p>}

      {eroare && (
        <p className="stare eroare">Nu am putut încărca datele: {eroare}</p>
      )}

      {!incarcare && !eroare && (
        <>
          <Rezumat
            total={destinatii.length}
            nevizitate={nevizitate.length}
            zile={totalZile(nevizitate)}
          />

          <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />

          <Cautare valoare={cautare} onChange={setCautare} />
          <PanouStatistici />
          {destinatii.length === 0 ? (
            <p className="gol">
              Nu există nicio destinație. Adaugă prima din formular.
            </p>
          ) : afisate.length === 0 ? (
            <p className="gol">Niciun rezultat pentru „{cautare}”.</p>
          ) : (
            <ListaDestinatii
              destinatii={afisate}
              onToggle={handleToggle}
            />
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '1.2rem',
            }}
          >
            <button
              type="button"
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => p - 1)}
            >
              Înapoi
            </button>
            <span>
              pagina {pagina} din {totalPagini}
            </span>
            <button
              type="button"
              disabled={pagina >= totalPagini}
              onClick={() => setPagina((p) => p + 1)}
            >
              Înainte
            </button>
          </div>
        </>
      )}
    </main>
  )
}