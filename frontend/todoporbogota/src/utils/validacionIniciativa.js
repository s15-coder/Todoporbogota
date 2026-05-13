/**
 * Validaciones para el formulario de postulación de iniciativas.
 * Solo frontend; el backend puede revalidar.
 */

const TITULO_MIN = 5
const TITULO_MAX = 120
const DESCRIPCION_MIN = 20
const DESCRIPCION_MAX = 800
const PARTICIPANTES_MIN = 1
const PARTICIPANTES_MAX = 10000
const IMAGEN_MAX_BYTES = 2 * 1024 * 1024 // 2 MB

export function validarTitulo(value) {
  if (!value || typeof value !== 'string') return 'El título es obligatorio.'
  const v = value.trim()
  if (v.length < TITULO_MIN) return `El título debe tener al menos ${TITULO_MIN} caracteres.`
  if (v.length > TITULO_MAX) return `El título no puede superar ${TITULO_MAX} caracteres.`
  return null
}

export function validarDescripcion(value) {
  if (!value || typeof value !== 'string') return 'La descripción es obligatoria.'
  const v = value.trim()
  if (v.length < DESCRIPCION_MIN) return `La descripción debe tener al menos ${DESCRIPCION_MIN} caracteres.`
  if (v.length > DESCRIPCION_MAX) return `La descripción no puede superar ${DESCRIPCION_MAX} caracteres.`
  return null
}

export function validarCategoria(value) {
  if (value === '' || value == null) return 'Debes elegir una categoría.'
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1 || n > 3) return 'Categoría no válida.'
  return null
}

export function validarBarrio(value) {
  if (!value || typeof value !== 'string') return null
  if (value.trim().length > 80) return 'El barrio no puede superar 80 caracteres.'
  return null
}

export function validarParticipantes(value) {
  if (value === '' || value == null || value === undefined) return null
  const n = Number(value)
  if (Number.isNaN(n)) return 'Debe ser un número.'
  if (!Number.isInteger(n) || n < PARTICIPANTES_MIN) return `Mínimo ${PARTICIPANTES_MIN} participante.`
  if (n > PARTICIPANTES_MAX) return `Máximo ${PARTICIPANTES_MAX} participantes.`
  return null
}

/**
 * Valida la imagen (obligatoria). dataURL es la cadena base64 tipo "data:image/...;base64,..."
 * o null/undefined si no se subió.
 */
export function validarImagen(dataURL) {
  if (!dataURL || typeof dataURL !== 'string') return 'Debes subir una imagen para la iniciativa.'
  if (!dataURL.startsWith('data:image/')) return 'El archivo debe ser una imagen (JPG, PNG o WebP).'
  try {
    const base64 = dataURL.split(',')[1]
    if (!base64) return 'Imagen no válida.'
    const bytes = Math.ceil((base64.length * 3) / 4)
    if (bytes > IMAGEN_MAX_BYTES) return `La imagen no puede superar ${IMAGEN_MAX_BYTES / 1024 / 1024} MB.`
  } catch {
    return 'Imagen no válida.'
  }
  return null
}

export function validarFormularioIniciativa(data) {
  const errores = {}
  const titulo = validarTitulo(data.titulo)
  const descripcion = validarDescripcion(data.descripcion)
  const categoria = validarCategoria(data.categoria)
  const barrio = validarBarrio(data.barrio)
  const participantes = validarParticipantes(data.participantes)
  const imagen = validarImagen(data.imagen)

  if (titulo) errores.titulo = titulo
  if (descripcion) errores.descripcion = descripcion
  if (categoria) errores.categoria = categoria
  if (barrio) errores.barrio = barrio
  if (participantes) errores.participantes = participantes
  if (imagen) errores.imagen = imagen

  return { errores, valido: Object.keys(errores).length === 0 }
}
