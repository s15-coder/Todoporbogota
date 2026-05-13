/**
 * Módulo para moderadores: listado de todas las propuestas postuladas.
 * Enlace a la conversación (historial) de cada una.
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import { getMisPropuestasStorage } from '../../utils/storageMisPropuestas'
import { normalizarPropuesta } from '../../utils/storageMisPropuestas'
import { getAdminMode } from '../../utils/adminMode'
import { ESTADOS_PROPUESTA_LABELS } from '../../data/estadosPropuesta'
import './Moderacion.css'

export default function Moderacion() {
  const navigate = useNavigate()
  const [propuestas, setPropuestas] = useState([])

  useEffect(() => {
    if (!getAdminMode()) {
      navigate('/', { replace: true })
      return
    }
    const list = getMisPropuestasStorage().map(normalizarPropuesta)
    setPropuestas(list)
  }, [navigate])

  return (
    <div className="moderacion">
      <SectionHeader
        title="Moderación de propuestas"
        subtitle="Revisa las iniciativas postuladas y gestiona su estado (aprobado, rechazado o propuesta de cambio). Un mensaje por turno por parte."
      />

      {propuestas.length === 0 ? (
        <div className="moderacion__empty">
          <p>No hay propuestas para revisar.</p>
        </div>
      ) : (
        <ul className="moderacion__list">
          {propuestas.map((p) => (
            <li key={p.id} className="moderacion__item">
              <Link to={`/moderacion/${p.id}`} className="moderacion__card">
                <div className="moderacion__card-main">
                  <h3 className="moderacion__card-title">{p.titulo}</h3>
                  <p className="moderacion__card-meta">
                    {p.categoria}
                    {p.barrio && ` · ${p.barrio}`}
                  </p>
                  <p className="moderacion__card-desc">{p.descripcion?.slice(0, 120)}{p.descripcion?.length > 120 ? '…' : ''}</p>
                </div>
                <span className={`moderacion__estado moderacion__estado--${(p.estado || 'PENDIENTE').toLowerCase().replace(/\s/g, '-')}`}>
                  {ESTADOS_PROPUESTA_LABELS[p.estado] || p.estado || 'Pendiente'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
