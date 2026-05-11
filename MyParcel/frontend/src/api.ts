export type Coord = { x: number; y: number }

const API_BASE = 'http://localhost:8000/api'

export async function recognizePdf(file: File) {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${API_BASE}/recognition`, {
    method: 'POST',
    body: form
  })

  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function visualize(payload: { sk: string; coords: Coord[]; file_name: string }) {
  const res = await fetch(`${API_BASE}/visualization`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getGeometry() {
  const res = await fetch(`${API_BASE}/geometry`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}