/**
 * Lectura/escritura de "Mis propuestas" en localStorage.
 * Clave: todoporbogota_mis_propuestas
 * Solo frontend; cuando exista backend se reemplazará por API.
 */

const STORAGE_KEY = 'todoporbogota_mis_propuestas'

export function getMisPropuestasStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function setMisPropuestasStorage(propuestas) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(propuestas))
    return true
  } catch {
    return false
  }
}

export function deletePropuestaStorage(id) {
  const list = getMisPropuestasStorage().filter((p) => p.id !== id)
  return setMisPropuestasStorage(list)
}

export function updatePropuestaStorage(id, datos) {
  const list = getMisPropuestasStorage().map((p) =>
    p.id === id ? { ...p, ...datos } : p
  )
  return setMisPropuestasStorage(list)
}

/**
 * Añade un mensaje al historial de la propuesta (chat moderación).
 * Opcionalmente actualiza el estado de la propuesta.
 */
export function appendHistorialStorage(id, entry, nuevoEstado) {
  const list = getMisPropuestasStorage()
  const prop = list.find((p) => p.id === id)
  if (!prop) return false
  const historial = Array.isArray(prop.historial) ? [...prop.historial, entry] : [entry]
  const datos = { historial }
  if (nuevoEstado) datos.estado = nuevoEstado
  return updatePropuestaStorage(id, datos)
}

/** Normaliza una propuesta para tener historial y estado correctos (retrocompatibilidad). */
export function normalizarPropuesta(p) {
  const historial = Array.isArray(p.historial) ? p.historial : [
    { autor: 'usuario', fecha: p.fecha || new Date().toISOString(), texto: 'Propuesta enviada para revisión.' },
  ]
  const estado = p.estado === 'pendiente' ? 'PENDIENTE' : (p.estado || 'PENDIENTE')
  return { ...p, historial, estado }
}
