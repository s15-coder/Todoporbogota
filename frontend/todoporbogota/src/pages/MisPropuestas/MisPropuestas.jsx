/**
 * Página: Mis propuestas postuladas.
 * Normal: Ver conversación, Editar, Eliminar.
 * Modo admin: Aprobar, Rechazar, Conversación.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import Card from '../../components/Card/Card'
import { getMisPropuestasStorage, deletePropuestaStorage, normalizarPropuesta, appendHistorialStorage } from '../../utils/storageMisPropuestas'
import { getAdminMode, ADMIN_MODE_EVENT } from '../../utils/adminMode'
import { ESTADOS_PROPUESTA_LABELS, ESTADOS_PROPUESTA } from '../../data/estadosPropuesta'
import './MisPropuestas.css'

export default function MisPropuestas() {
  const [propuestas, setPropuestas] = useState([])
  const [loading, setLoading] = useState(true)
  const [adminMode, setAdminMode] = useState(() => getAdminMode())

  const refresh = () => setPropuestas(getMisPropuestasStorage().map(normalizarPropuesta))

  useEffect(() => {
    refresh()
    setLoading(false)
  }, [])

  useEffect(() => {
    const sync = () => setAdminMode(getAdminMode())
    window.addEventListener(ADMIN_MODE_EVENT, sync)
    return () => window.removeEventListener(ADMIN_MODE_EVENT, sync)
  }, [])

  const handleEliminar = (p) => {
    if (!window.confirm('¿Eliminar esta propuesta? Esta acción no se puede deshacer.')) return
    if (deletePropuestaStorage(p.id)) {
      refresh()
    }
  }

  const handleAprobar = (p) => {
    if (!window.confirm('¿Aprobar esta propuesta?')) return
    const entry = { autor: 'moderador', fecha: new Date().toISOString(), texto: 'Propuesta aprobada.', estado: ESTADOS_PROPUESTA.APROBADO }
    if (appendHistorialStorage(p.id, entry, ESTADOS_PROPUESTA.APROBADO)) refresh()
  }

  const handleRechazar = (p) => {
    if (!window.confirm('¿Rechazar esta propuesta?')) return
    const entry = { autor: 'moderador', fecha: new Date().toISOString(), texto: 'Propuesta rechazada.', estado: ESTADOS_PROPUESTA.RECHAZADO }
    if (appendHistorialStorage(p.id, entry, ESTADOS_PROPUESTA.RECHAZADO)) refresh()
  }

  if (loading) {
    return (
      <div className="mis-propuestas">
        <SectionHeader title="Mis propuestas" subtitle="Tus iniciativas postuladas." />
        <p className="mis-propuestas__loading">Cargando…</p>
      </div>
    )
  }

  return (
    <div className="mis-propuestas">
      <SectionHeader
        title="Mis propuestas"
        subtitle="Aquí puedes ver las iniciativas que has postulado para mejorar tu barrio."
      />

      <div className="mis-propuestas__actions">
        {propuestas.length < 1 && (
          <Link to="/iniciativas/postular" className="btn btn--primary">
            Postular una iniciativa
          </Link>
        )}
        <Link to="/iniciativas" className="btn btn--outline">
          Ver todas las iniciativas
        </Link>
      </div>

      {propuestas.length === 0 ? (
        <div className="mis-propuestas__empty">
          <p>Aún no has postulado ninguna iniciativa.</p>
          <Link to="/iniciativas/postular" className="btn btn--primary">
            Postular iniciativa
          </Link>
        </div>
      ) : (
        <div className="mis-propuestas__grid">
          {propuestas.map((p) => (
            <article key={p.id} className="mis-propuestas__card-wrapper">
              <Card
                image={p.imagen}
                title={p.titulo}
                description={p.descripcion}
                meta={p.categoria}
                tags={[
                  ...(p.barrio ? [p.barrio] : []),
                  ...(p.participantes != null ? [`${p.participantes} participantes`] : []),
                  ESTADOS_PROPUESTA_LABELS[p.estado] || p.estado || 'Pendiente',
                ]}
              />
              <div className="mis-propuestas__card-footer">
                <span className="mis-propuestas__meta-fecha">
                  Postulada: {new Date(p.fecha).toLocaleDateString('es-CO', { dateStyle: 'medium' })}
                </span>
                <div className="mis-propuestas__actions-card">
                  {adminMode ? (
                    <>
                      <button type="button" className="btn btn--outline btn--sm mis-propuestas__btn-aprobar" onClick={() => handleAprobar(p)}>
                        Aprobar
                      </button>
                      <button type="button" className="btn btn--outline btn--sm mis-propuestas__btn-rechazar" onClick={() => handleRechazar(p)}>
                        Rechazar
                      </button>
                      <Link to={`/moderacion/${p.id}`} className="btn btn--outline btn--sm">
                        Conversación
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to={`/iniciativas/mis-propuestas/ver/${p.id}`} className="btn btn--outline btn--sm">
                        Ver conversación
                      </Link>
                      <Link to="/iniciativas/mis-propuestas/editar" state={{ id: p.id }} className="btn btn--outline btn--sm">
                        Editar
                      </Link>
                      <button type="button" className="btn btn--outline btn--sm mis-propuestas__btn-eliminar" onClick={() => handleEliminar(p)}>
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
