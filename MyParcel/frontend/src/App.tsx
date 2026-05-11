import { useMemo, useState } from 'react'
import { recognizePdf, visualize, getGeometry, Coord } from './api'
import PdfViewer from './components/PdfViewer'
import MapPanel from './components/MapPanel'
import CoordinateModal from './components/CoordinateModal'

const skOptions = [
  { label: 'МСК 50 зона 1', value: 'msk50z1' },
  { label: 'МСК 50 зона 2', value: 'msk50z2' }
]

type StatusType = 'idle' | 'success' | 'error' | 'loading'

export default function App() {
  const [sk, setSk] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string>('')
  const [coords, setCoords] = useState<Coord[]>([])
  const [showCoordsModal, setShowCoordsModal] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<StatusType>('idle')
  const [geometryList, setGeometryList] = useState<{ name: string; WKT: string }[]>([])
  const [selectedWkt, setSelectedWkt] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const canUpload = useMemo(() => !!sk, [sk])

  const refreshGeometry = async () => {
    const data = await getGeometry()
    setGeometryList(data.geometry || [])
  }

  const onUpload = async (f: File) => {
    setFile(f)
    setPdfUrl(URL.createObjectURL(f))
    setMessage('Файл загружен. Выполняется распознавание...')
    setStatus('loading')
    setLoading(true)

    try {
      const result = await recognizePdf(f)
      if (result?.result?.table) {
        setCoords(result.result.coords)
        setShowCoordsModal(true)
        setMessage('')
        setStatus('idle')
      } else {
        setMessage('В загруженном файле не удалось найти таблицу с координатами')
        setStatus('error')
      }
    } catch {
      setMessage('Не удалось распознать PDF-файл')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const onConfirmCoords = async (editedCoords: Coord[]) => {
    if (!file) return
    const skValue = sk === 'МСК 50 зона 1' ? 'msk50z1' : 'msk50z2'
    setLoading(true)
    setStatus('loading')
    setMessage('Выполняется визуализация...')

    try {
      const result = await visualize({
        sk: skValue,
        coords: editedCoords,
        file_name: file.name
      })

      setShowCoordsModal(false)

      if (result?.result) {
        setMessage('Перейдите к просмотру координат на карте')
        setStatus('success')
        await refreshGeometry()
      } else {
        setMessage('Найдена ошибка. Проверьте корректность загруженных координат')
        setStatus('error')
      }
    } catch {
      setMessage('Ошибка при визуализации координат')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowCoordsModal(false)
    setFile(null)
    setPdfUrl('')
    setCoords([])
    setMessage('')
    setStatus('idle')
  }

  return (
    <div className="page">
      <header className="header">
        <div className="logo-box">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>
        <h1>Мой участок</h1>
      </header>

      <section className="controls">
        <div className="field">
          <label>Система координат</label>
          <select value={sk} onChange={(e) => setSk(e.target.value)}>
            <option value="">Выберите значение</option>
            {skOptions.map((o) => (
              <option key={o.value} value={o.label}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Загрузить СРЗУ</label>
          <input
            type="file"
            accept="application/pdf"
            disabled={!canUpload}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onUpload(f)
              e.target.value = ''
            }}
          />
        </div>
      </section>

      {message && (
        <div className={`message ${status === 'success' ? 'message-success' : status === 'error' ? 'message-error' : ''}`}>
          {loading ? <span className="loader" /> : null}
          <span>{message}</span>
        </div>
      )}

      <main className="layout">
        <div className="card fixed-card">
          <h2>Просмотр PDF</h2>
          <PdfViewer url={pdfUrl} />
        </div>

        <div className="card fixed-card">
          <h2>Карта</h2>
          <MapPanel
            geometryList={geometryList}
            onSelectGeometry={setSelectedWkt}
            selectedWkt={selectedWkt}
            onLoadGeometry={refreshGeometry}
          />
        </div>
      </main>

      {showCoordsModal && (
        <CoordinateModal
          coords={coords}
          onConfirm={onConfirmCoords}
          onClose={handleCloseModal}
          status={status}
          loading={loading}
        />
      )}
    </div>
  )
}