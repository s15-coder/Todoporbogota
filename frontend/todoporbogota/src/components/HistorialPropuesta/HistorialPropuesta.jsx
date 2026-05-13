/**
 * Historial de una propuesta tipo chat.
 * Muestra mensajes de usuario y moderador; indica cambio de estado cuando aplica.
 */
import { ESTADOS_PROPUESTA_LABELS } from '../../data/estadosPropuesta'
import './HistorialPropuesta.css'

export default function HistorialPropuesta({ historial }) {
  const list = Array.isArray(historial) ? historial : []

  return (
    <div className="historial-propuesta">
      {list.map((item, index) => (
        <div
          key={index}
          className={`historial-propuesta__mensaje historial-propuesta__mensaje--${item.autor}`}
        >
          <div className="historial-propuesta__bubble">
            <span className="historial-propuesta__autor">
              {item.autor === 'moderador' ? 'Moderador' : 'Usuario'}
            </span>
            <p className="historial-propuesta__texto">{item.texto}</p>
            {item.estado && (
              <span className="historial-propuesta__estado">
                Estado: {ESTADOS_PROPUESTA_LABELS[item.estado] || item.estado}
              </span>
            )}
            <time className="historial-propuesta__fecha" dateTime={item.fecha}>
              {item.fecha ? new Date(item.fecha).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : ''}
            </time>
          </div>
        </div>
      ))}
    </div>
  )
}
