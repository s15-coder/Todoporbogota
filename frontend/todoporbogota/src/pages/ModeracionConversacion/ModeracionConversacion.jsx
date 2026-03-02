/**
 * Vista de conversación para el moderador.
 * Ver historial y enviar un mensaje con cambio de estado (un mensaje por turno).
 */
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import HistorialPropuesta from '../../components/HistorialPropuesta/HistorialPropuesta'
import { getMisPropuestasStorage, appendHistorialStorage, normalizarPropuesta } from '../../utils/storageMisPropuestas'
import { getAdminMode } from '../../utils/adminMode'
import { ESTADOS_PROPUESTA_LABELS, ESTADOS_SELECT_MODERADOR } from '../../data/estadosPropuesta'
import './ModeracionConversacion.css'

export default function ModeracionConversacion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [propuesta, setPropuesta] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [estadoSel, setEstadoSel] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!getAdminMode()) {
      navigate('/', { replace: true })
      return
    }
    const list = getMisPropuestasStorage()
    const p = list.find((item) => item.id === id)
    if (!p) {
      navigate('/moderacion', { replace: true })
      return
    }
    setPropuesta(normalizarPropuesta(p))
  }, [id, navigate])

  const historial = propuesta?.historial || []
  const ultimoAutor = historial.length > 0 ? historial[historial.length - 1].autor : null
  const puedeEnviarModerador = ultimoAutor !== 'moderador' // si el último es usuario o no hay mensajes, puede el moderador

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!propuesta || !puedeEnviarModerador) return
    const texto = mensaje.trim()
    if (!texto) {
      setError('Escribe un mensaje.')
      return
    }
    if (!estadoSel) {
      setError('Debes elegir un estado (Aprobado, Rechazado o Propuesta de cambio).')
      return
    }
    const entry = {
      autor: 'moderador',
      fecha: new Date().toISOString(),
      texto,
      estado: estadoSel,
    }
    if (!appendHistorialStorage(propuesta.id, entry, estadoSel)) {
      setError('No se pudo guardar.')
      return
    }
    const updated = getMisPropuestasStorage().find((p) => p.id === propuesta.id)
    setPropuesta(updated ? normalizarPropuesta(updated) : null)
    setMensaje('')
    setEstadoSel('')
  }

  if (!propuesta) {
    return (
      <div className="moderacion-conversacion">
        <SectionHeader title="Conversación" subtitle="Cargando…" />
        <p className="moderacion-conversacion__loading">Cargando…</p>
      </div>
    )
  }

  return (
    <div className="moderacion-conversacion">
      <div className="moderacion-conversacion__header">
        <Link to="/moderacion" className="btn btn--outline btn--sm">
          ← Volver al listado
        </Link>
        <h1 className="moderacion-conversacion__titulo">{propuesta.titulo}</h1>
        <p className="moderacion-conversacion__meta">
          {propuesta.categoria}
          {propuesta.barrio && ` · ${propuesta.barrio}`}
        </p>
        <span className={`moderacion-conversacion__estado moderacion-conversacion__estado--${(propuesta.estado || 'pendiente').toLowerCase().replace(/\s/g, '-')}`}>
          {ESTADOS_PROPUESTA_LABELS[propuesta.estado] || propuesta.estado || 'Pendiente'}
        </span>
      </div>

      <HistorialPropuesta historial={propuesta.historial} />

      {puedeEnviarModerador ? (
        <form className="moderacion-conversacion__form" onSubmit={handleSubmit}>
          {error && <p className="moderacion-conversacion__error" role="alert">{error}</p>}
          <div className="moderacion-conversacion__field">
            <label htmlFor="mod-estado" className="moderacion-conversacion__label">
              Nuevo estado <span className="form-iniciativa__required">*</span>
            </label>
            <select
              id="mod-estado"
              value={estadoSel}
              onChange={(e) => setEstadoSel(e.target.value)}
              className="moderacion-conversacion__select"
              required
            >
              <option value="">Selecciona el estado</option>
              {ESTADOS_SELECT_MODERADOR.map((est) => (
                <option key={est} value={est}>
                  {ESTADOS_PROPUESTA_LABELS[est] || est}
                </option>
              ))}
            </select>
          </div>
          <div className="moderacion-conversacion__field">
            <label htmlFor="mod-mensaje" className="moderacion-conversacion__label">
              Tu mensaje (un mensaje por turno) <span className="form-iniciativa__required">*</span>
            </label>
            <textarea
              id="mod-mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Explica al usuario tu decisión..."
              className="moderacion-conversacion__textarea"
              rows={3}
              required
            />
          </div>
          <button type="submit" className="btn btn--primary">
            Enviar respuesta
          </button>
        </form>
      ) : (
        <p className="moderacion-conversacion__turno">
          Esperando respuesta del usuario. Solo se permite un mensaje por turno.
        </p>
      )}
    </div>
  )
}
