/**
 * Iniciativas Ciudadanas Page
 * 
 * Displays community initiatives with filter capabilities.
 * Features a "Project of the Month" highlighted section
 * and a card grid for all initiatives.
 * Filterable by category and Bogotá locality.
 */
import { useState, useMemo } from 'react'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import FilterBar from '../../components/FilterBar/FilterBar'
import Card from '../../components/Card/Card'
import iniciativas from '../../data/iniciativas.json'
import './Iniciativas.css'

// Extract unique categories and localities for filter options
const categories = [...new Set(iniciativas.map((i) => i.category))]
const localities = [...new Set(iniciativas.map((i) => i.locality))]

export default function Iniciativas() {
    const [categoryFilter, setCategoryFilter] = useState('Todos')
    const [localityFilter, setLocalityFilter] = useState('Todos')

    // Memoize filtered results for performance
    const filtered = useMemo(() => {
        return iniciativas.filter((item) => {
            const matchCategory = categoryFilter === 'Todos' || item.category === categoryFilter
            const matchLocality = localityFilter === 'Todos' || item.locality === localityFilter
            return matchCategory && matchLocality
        })
    }, [categoryFilter, localityFilter])

    // Project of the month — first featured initiative
    const projectOfMonth = iniciativas.find((i) => i.featured)

    return (
        <div className="iniciativas">
            <SectionHeader
                title="Iniciativas Ciudadanas"
                subtitle="Proyectos comunitarios que generan impacto social, cultural y ambiental positivo en Bogotá."
            />

            {/* Project of the Month highlight */}
            {projectOfMonth && (
                <section className="iniciativas__featured">
                    <span className="iniciativas__featured-label">🏆 Proyecto del Mes</span>
                    <div className="iniciativas__featured-card">
                        <Card
                            image={projectOfMonth.image}
                            title={projectOfMonth.title}
                            description={projectOfMonth.description}
                            meta={projectOfMonth.category}
                            tags={[projectOfMonth.locality, `${projectOfMonth.participants} participantes`]}
                            className="card--featured"
                        />
                    </div>
                </section>
            )}

            {/* Filters */}
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
                    label="Localidad"
                />
            </div>

            {/* Initiative cards grid */}
            <div className="iniciativas__grid">
                {filtered.map((item) => (
                    <Card
                        key={item.id}
                        image={item.image}
                        title={item.title}
                        description={item.description}
                        meta={item.category}
                        tags={[item.locality, item.status]}
                    />
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="iniciativas__empty">No se encontraron iniciativas con esos filtros.</p>
            )}
        </div>
    )
}
