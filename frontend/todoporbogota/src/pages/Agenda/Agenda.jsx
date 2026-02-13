/**
 * Agenda Bogotá Page
 * 
 * Events calendar filtered by date range and locality.
 * Emphasis on free or low-cost cultural events.
 */
import { useState, useMemo } from 'react'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import FilterBar from '../../components/FilterBar/FilterBar'
import agenda from '../../data/agenda.json'
import './Agenda.css'

const localities = [...new Set(agenda.map((e) => e.locality))]
const categories = [...new Set(agenda.map((e) => e.category))]

export default function Agenda() {
    const [localityFilter, setLocalityFilter] = useState('Todos')
    const [categoryFilter, setCategoryFilter] = useState('Todos')

    const filtered = useMemo(() => {
        return agenda
            .filter((e) => localityFilter === 'Todos' || e.locality === localityFilter)
            .filter((e) => categoryFilter === 'Todos' || e.category === categoryFilter)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
    }, [localityFilter, categoryFilter])

    return (
        <div className="agenda">
            <SectionHeader
                title="Agenda Bogotá"
                subtitle="Eventos culturales, deportivos y comunitarios en la ciudad. La mayoría son gratuitos. ¡No te los pierdas!"
            />

            <div className="agenda__filters">
                <FilterBar
                    filters={localities}
                    activeFilter={localityFilter}
                    onFilterChange={setLocalityFilter}
                    label="Localidad"
                />
                <FilterBar
                    filters={categories}
                    activeFilter={categoryFilter}
                    onFilterChange={setCategoryFilter}
                    label="Categoría"
                />
            </div>

            <div className="agenda__list">
                {filtered.map((event) => (
                    <article key={event.id} className="agenda__event">
                        <div className="agenda__event-date">
                            <span className="agenda__day">
                                {new Date(event.date).toLocaleDateString('es-CO', { day: 'numeric' })}
                            </span>
                            <span className="agenda__month">
                                {new Date(event.date).toLocaleDateString('es-CO', { month: 'short' })}
                            </span>
                        </div>
                        <div className="agenda__event-body">
                            <div className="agenda__event-header">
                                <h3>{event.title}</h3>
                                {event.free && <span className="agenda__free">Gratis</span>}
                            </div>
                            <p>{event.description}</p>
                            <div className="agenda__event-meta">
                                <span>🕐 {event.time}</span>
                                <span>📍 {event.venue}</span>
                                <span>🏘️ {event.locality}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="agenda__empty">No hay eventos que coincidan con los filtros seleccionados.</p>
            )}
        </div>
    )
}
