/**
 * SectionHeader Component
 * 
 * Consistent header for each page section.
 * Includes a title, optional subtitle/description, and a decorative accent line.
 */
import './SectionHeader.css'

export default function SectionHeader({ title, subtitle }) {
    return (
        <header className="section-header">
            <h1 className="section-header__title">{title}</h1>
            {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
            <div className="section-header__accent" />
        </header>
    )
}
