/**
 * Vista de conversación para el usuario que postuló la propuesta.
 * Ver historial y responder cuando sea su turno (un mensaje por turno).
 */
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import HistorialPropuesta from '../../components/HistorialPropuesta/HistorialPropuesta'
import { getMisPropuestasStorage, appendHistorialStorage, normalizarPropuesta } from '../../utils/storageMisPropuestas'
import { ESTADOS_PROPUESTA_LABELS } from '../../data/estadosPropuesta'
import './VerConversacion.css'

export default function VerConversacion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [propuesta, setPropuesta] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const list = getMisPropuestasStorage()
    const p = list.find((item) => item.id === id)
    if (!p) {
      navigate('/iniciativas/mis-propuestas', { replace: true })
      return
    }
    setPropuesta(normalizarPropuesta(p))
  }, [id, navigate])

  const historial = propuesta?.historial || []
  const ultimoAutor = historial.length > 0 ? historial[historial.length - 1].autor : null
  const puedeEnviarUsuario = ultimoAutor === 'moderador'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!propuesta || !puedeEnviarUsuario) return
    const texto = mensaje.trim()
    if (!texto) {
      setError('Escribe tu mensaje.')
      return
    }
    const entry = {
      autor: 'usuario',
      fecha: new Date().toISOString(),
      texto,
    }
    if (!appendHistorialStorage(propuesta.id, entry)) {
      setError('No se pudo guardar.')
      return
    }
    const updated = getMisPropuestasStorage().find((p) => p.id === propuesta.id)
    setPropuesta(updated ? normalizarPropuesta(updated) : null)
    setMensaje('')
  }

  if (!propuesta) {
    return (
      <div className="ver-conversacion">
        <SectionHeader title="Conversación" subtitle="Cargando…" />
        <p className="ver-conversacion__loading">Cargando…</p>
      </div>
    )
  }

  return (
    <div className="ver-conversacion">
      <div className="ver-conversacion__header">
        <Link to="/iniciativas/mis-propuestas" className="btn btn--outline btn--sm">
          ← Mis propuestas
        </Link>
        <h1 className="ver-conversacion__titulo">{propuesta.titulo}</h1>
        <span className={`ver-conversacion__estado ver-conversacion__estado--${(propuesta.estado || 'pendiente').toLowerCase().replace(/\s/g, '-')}`}>
          {ESTADOS_PROPUESTA_LABELS[propuesta.estado] || propuesta.estado || 'Pendiente'}
        </span>
      </div>

      <HistorialPropuesta historial={propuesta.historial} />

      {puedeEnviarUsuario ? (
        <form className="ver-conversacion__form" onSubmit={handleSubmit}>
          {error && <p className="ver-conversacion__error" role="alert">{error}</p>}
          <div className="ver-conversacion__field">
            <label htmlFor="user-mensaje" className="ver-conversacion__label">
              Tu respuesta (un mensaje por turno)
            </label>
            <textarea
              id="user-mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Responde al moderador..."
              className="ver-conversacion__textarea"
              rows={3}
              required
            />
          </div>
          <button type="submit" className="btn btn--primary">
            Enviar
          </button>
        </form>
      ) : (
        <p className="ver-conversacion__turno">
          {ultimoAutor === 'usuario'
            ? 'Esperando respuesta del moderador. Solo se permite un mensaje por turno.'
            : 'El moderador aún no ha respondido.'}
        </p>
      )}
    </div>
  )
}
