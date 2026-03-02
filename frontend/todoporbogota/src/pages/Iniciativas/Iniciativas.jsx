/**
 * Iniciativas Ciudadanas Page
 * 
 * Muestra solo las iniciativas postuladas por los usuarios (localStorage).
 * Filtros por categoría y barrio. Sin datos quemados de ejemplo.
 */
import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import FilterBar from '../../components/FilterBar/FilterBar'
import Card from '../../components/Card/Card'
import { getMisPropuestasStorage } from '../../utils/storageMisPropuestas'
import { ESTADOS_PROPUESTA_LABELS } from '../../data/estadosPropuesta'
import { getViewAsVisitor, VIEW_AS_VISITOR_EVENT } from '../../utils/adminMode'
import './Iniciativas.css'

// Normaliza una propuesta al formato de la lista. Si viewAsVisitor, ninguna es "tuya".
function toIniciativaItem(p, viewAsVisitor) {
    const estado = p.estado === 'pendiente' ? 'PENDIENTE' : (p.estado || 'PENDIENTE')
    return {
        id: p.id,
        title: p.titulo,
        description: p.descripcion,
        category: p.categoria,
        locality: p.barrio || '—',
        status: ESTADOS_PROPUESTA_LABELS[estado] || estado,
        image: p.imagen || null,
        isUserProposal: !viewAsVisitor,
    }
}

export default function Iniciativas() {
    const [categoryFilter, setCategoryFilter] = useState('Todos')
    const [localityFilter, setLocalityFilter] = useState('Todos')
    const [userProposals, setUserProposals] = useState([])
    const [viewAsVisitor, setViewAsVisitor] = useState(() => getViewAsVisitor())

    useEffect(() => {
        const sync = () => setViewAsVisitor(getViewAsVisitor())
        sync()
        window.addEventListener(VIEW_AS_VISITOR_EVENT, sync)
        return () => window.removeEventListener(VIEW_AS_VISITOR_EVENT, sync)
    }, [])

    useEffect(() => {
        setUserProposals(getMisPropuestasStorage().map((p) => toIniciativaItem(p, viewAsVisitor)))
    }, [viewAsVisitor])

    // Solo iniciativas postuladas por usuarios (sin datos de ejemplo)
    const allItems = useMemo(() => [...userProposals], [userProposals])

    // Categorías y localidades para filtros (incluyen las de las propuestas del usuario)
    const categories = useMemo(() => [...new Set(allItems.map((i) => i.category))].sort(), [allItems])
    const localities = useMemo(() => [...new Set(allItems.map((i) => i.locality))].sort(), [allItems])

    const filtered = useMemo(() => {
        return allItems.filter((item) => {
            const matchCategory = categoryFilter === 'Todos' || item.category === categoryFilter
            const matchLocality = localityFilter === 'Todos' || item.locality === localityFilter
            return matchCategory && matchLocality
        })
    }, [allItems, categoryFilter, localityFilter])

    return (
        <div className="iniciativas">
            <SectionHeader
                title="Iniciativas Ciudadanas"
                subtitle="Proyectos comunitarios que generan impacto social, cultural y ambiental positivo en Bogotá."
            />

            <div className="iniciativas__ctas">
                <Link to="/iniciativas/postular" className="btn btn--primary">
                    Postular iniciativa
                </Link>
                <Link to="/iniciativas/mis-propuestas" className="btn btn--outline">
                    Mis propuestas
                </Link>
            </div>

            {/* Filtros: solo si hay iniciativas */}
            {allItems.length > 0 && (
            <div className="iniciativas__filters">
                <FilterBar
                    filters={categories}
                    activeFilter={categoryFilter}
                    onFilterChange={setCategoryFilter}
                    label="Categoría"
                />
                <FilterBar
                    filters={localities}
                    activeFilter={localityFilter}
                    onFilterChange={setLocalityFilter}
                    label="Barrio"
                />
            </div>
            )}

            {/* Grid de iniciativas postuladas */}
            <div className="iniciativas__grid">
                {filtered.map((item) => (
                    <Card
                        key={item.id}
                        image={item.image}
                        title={item.title}
                        description={item.description}
                        meta={item.category}
                        tags={[item.locality, item.status]}
                        className={item.isUserProposal ? 'card--user-proposal' : ''}
                    >
                        {item.isUserProposal && (
                            <span className="iniciativas__badge-user">Tu propuesta</span>
                        )}
                    </Card>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="iniciativas__empty">
                    {allItems.length === 0
                        ? (
                            <>
                                <p>Aún no hay iniciativas postuladas.</p>
                                <p className="iniciativas__empty-hint">Sé el primero en proponer una iniciativa para mejorar tu barrio.</p>
                                <Link to="/iniciativas/postular" className="btn btn--primary iniciativas__empty-cta">
                                    Postular iniciativa
                                </Link>
                            </>
                        )
                        : <p>No se encontraron iniciativas con esos filtros.</p>
                    }
                </div>
            )}
        </div>
    )
}
