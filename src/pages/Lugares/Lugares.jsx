/**
 * Lugares Page
 * 
 * Curated places in Bogotá: parks, viewpoints, cafés, libraries, cultural centers.
 * Filterable by category with community ratings and recommendation badges.
 */
import { useState, useMemo } from 'react'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import FilterBar from '../../components/FilterBar/FilterBar'
import Card from '../../components/Card/Card'
import lugares from '../../data/lugares.json'
import './Lugares.css'

const categories = [...new Set(lugares.map((l) => l.category))]

export default function Lugares() {
    const [filter, setFilter] = useState('Todos')

    const filtered = useMemo(() => {
        if (filter === 'Todos') return lugares
        return lugares.filter((l) => l.category === filter)
    }, [filter])

    return (
        <div className="lugares">
            <SectionHeader
                title="Lugares"
                subtitle="Rincones icónicos, alternativos y culturales de Bogotá recomendados por la comunidad."
            />

            <FilterBar
                filters={categories}
                activeFilter={filter}
                onFilterChange={setFilter}
                label="Categoría"
            />

            <div className="lugares__grid">
                {filtered.map((place) => (
                    <Card
                        key={place.id}
                        image={place.image}
                        title={place.name}
                        description={place.description}
                        meta={place.category}
                        tags={place.tags}
                    >
                        <div className="lugares__meta">
                            <span className="lugares__rating">⭐ {place.communityRating}</span>
                            {place.recommended && (
                                <span className="lugares__recommended">👍 Recomendado</span>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {filtered.length === 0 && (
                <p className="lugares__empty">No se encontraron lugares en esta categoría.</p>
            )}
        </div>
    )
}
