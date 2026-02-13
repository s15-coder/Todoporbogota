/**
 * FilterBar Component
 * 
 * Reusable horizontal filter bar with selectable chips/buttons.
 * Used in Iniciativas, Lugares, and Agenda pages to filter content
 * by categories or localities.
 */
import './FilterBar.css'

export default function FilterBar({ filters, activeFilter, onFilterChange, label }) {
    return (
        <div className="filter-bar">
            {label && <span className="filter-bar__label">{label}</span>}
            <div className="filter-bar__options">
                <button
                    className={`filter-bar__btn ${activeFilter === 'Todos' ? 'filter-bar__btn--active' : ''}`}
                    onClick={() => onFilterChange('Todos')}
                >
                    Todos
                </button>
                {filters.map((filter) => (
                    <button
                        key={filter}
                        className={`filter-bar__btn ${activeFilter === filter ? 'filter-bar__btn--active' : ''}`}
                        onClick={() => onFilterChange(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    )
}
