import { useEffect, useState } from 'react'
import { Coord } from '../api'

type Props = {
  coords: Coord[]
  onConfirm: (coords: Coord[]) => void
  onClose: () => void
  status?: 'idle' | 'success' | 'error' | 'loading'
  loading?: boolean
}

export default function CoordinateModal({ coords, onConfirm, onClose, status = 'idle', loading = false }: Props) {
  const [localCoords, setLocalCoords] = useState<Coord[]>(coords)

  useEffect(() => {
    setLocalCoords(coords)
  }, [coords])

  const updateCoord = (index: number, key: 'x' | 'y', value: string) => {
    const copy = [...localCoords]
    copy[index] = { ...copy[index], [key]: Number(value) }
    setLocalCoords(copy)
  }

  const addPoint = () => {
    setLocalCoords([...localCoords, { x: 0, y: 0 }])
  }

  const deletePoint = (index: number) => {
    setLocalCoords(localCoords.filter((_, i) => i !== index))
  }

  const themeClass =
    status === 'success' ? 'modal-theme-success' : status === 'error' ? 'modal-theme-error' : 'modal-theme-default'

  return (
    <div className="modal-overlay">
      <div className={`modal modal-full ${themeClass}`}>
        <div className="modal-header">
          <h3>Координаты</h3>
          <div className="modal-status">
            {loading ? <span className="loader" /> : null}
            <span>
              {status === 'success'
                ? 'Успешно'
                : status === 'error'
                  ? 'Ошибка'
                  : 'Редактирование координат'}
            </span>
          </div>
        </div>

        <div className="coord-list modal-scroll">
          {localCoords.map((c, idx) => (
            <div className="coord-row" key={idx}>
              <input
                type="string"
                step="0.000001"
                value={c.x}
                onChange={(e) => updateCoord(idx, 'x', e.target.value)}
                placeholder="X"
              />
              <input
                type="string"
                step="0.000001"
                value={c.y}
                onChange={(e) => updateCoord(idx, 'y', e.target.value)}
                placeholder="Y"
              />
              <button className="icon-button" onClick={() => deletePoint(idx)} title="Удалить точку">
                🗑
              </button>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="secondary add-point" onClick={addPoint}>
  Добавить точку
</button>
          <div className="action-group">
            <button className="primary" onClick={() => onConfirm(localCoords)} disabled={loading}>
              Подтверждаю
            </button>
            <button className="secondary" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}