/**
 * Cliente API para iniciativas (MongoDB).
 * Usa VITE_API_URL y authToken de localStorage.
 * En desarrollo, si VITE_API_URL no está definida, usa http://localhost:5000.
 */
const getBase = () => {
  const url = import.meta.env.VITE_API_URL || ''
  if (url) return url
  if (import.meta.env.DEV) return 'http://localhost:5000'
  return ''
}
const getToken = () => localStorage.getItem('authToken')

/** Convierte item de la API al formato "propuesta" del frontend (titulo, barrio, estado, etc.) */
export function apiItemToPropuesta(item) {
  if (!item) return null
  return {
    id: item.id || item._id,
    titulo: item.title,
    descripcion: item.description,
    categoria: item.category,
    barrio: item.locality,
    imagen: item.image,
    fecha: item.createdAt,
    estado: item.status || 'PENDIENTE',
    participantes: item.participants,
    historial: item.historial || [],
    featured: item.featured,
    submittedBy: item.submittedBy,
  }
}

/** Convierte item de la API al formato de lista (title, category, locality, status, image) */
export function apiItemToIniciativaItem(item, isUserProposal = false) {
  if (!item) return null
  return {
    id: item.id || item._id,
    title: item.title,
    description: item.description,
    category: item.category,
    locality: item.locality,
    status: item.status || 'PENDIENTE',
    image: item.image || null,
    isUserProposal,
  }
}

async function fetchApi(path, options = {}) {
  const base = getBase()
  if (!base) throw new Error('VITE_API_URL no configurada')
  const url = `${base.replace(/\/$/, '')}${path}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const err = new Error(res.statusText || 'Error en la API')
    err.status = res.status
    err.body = await res.json().catch(() => ({}))
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

/** GET /api/iniciativas?category=...&locality=...&status=...&featured=true */
export async function getIniciativas(params = {}) {
  const q = new URLSearchParams()
  if (params.category) q.set('category', params.category)
  if (params.locality) q.set('locality', params.locality)
  if (params.status) q.set('status', params.status)
  if (params.featured) q.set('featured', 'true')
  const query = q.toString()
  const path = `/api/iniciativas${query ? `?${query}` : ''}`
  const data = await fetchApi(path)
  return data.iniciativas || []
}

/** GET /api/iniciativas/featured */
export async function getFeaturedIniciativas() {
  const data = await fetchApi('/api/iniciativas/featured')
  return data.iniciativas || []
}

/** GET /api/iniciativas/mis-propuestas (requiere auth) */
export async function getMisPropuestasApi() {
  const data = await fetchApi('/api/iniciativas/mis-propuestas')
  return (data.iniciativas || []).map(apiItemToPropuesta)
}

/** GET /api/iniciativas/:id */
export async function getIniciativaById(id) {
  return fetchApi(`/api/iniciativas/${id}`)
}

/** POST /api/iniciativas (requiere auth). payload: titulo, descripcion, categoria, barrio, imagen, participantes, etc. */
export async function createIniciativa(payload) {
  const body = {
    title: payload.titulo,
    description: payload.descripcion,
    category: payload.categoria,
    locality: payload.barrio,
    image: payload.imagen,
    participants: payload.participantes ?? 0,
    contactEmail: payload.contactEmail,
    contactPhone: payload.contactPhone,
    address: payload.address,
    tags: payload.tags,
  }
  return fetchApi('/api/iniciativas', { method: 'POST', body: JSON.stringify(body) })
}

/** PATCH /api/iniciativas/:id (requiere auth) */
export async function updateIniciativa(id, payload) {
  const body = {}
  if (payload.titulo !== undefined) body.title = payload.titulo
  if (payload.descripcion !== undefined) body.description = payload.descripcion
  if (payload.categoria !== undefined) body.category = payload.categoria
  if (payload.barrio !== undefined) body.locality = payload.barrio
  if (payload.imagen !== undefined) body.image = payload.imagen
  if (payload.participantes !== undefined) body.participants = payload.participantes
  if (payload.estado !== undefined) body.status = payload.estado
  if (payload.historial !== undefined) body.historial = payload.historial
  return fetchApi(`/api/iniciativas/${id}`, { method: 'PATCH', body: JSON.stringify(body) })
}

/** DELETE /api/iniciativas/:id (requiere auth) */
export async function deleteIniciativa(id) {
  return fetchApi(`/api/iniciativas/${id}`, { method: 'DELETE' })
}

/** ¿Tenemos base URL configurada? */
export function hasApi() {
  return !!getBase()
}

/** ¿Usuario con token (para mis propuestas por API)? */
export function hasAuth() {
  return !!getToken()
}
