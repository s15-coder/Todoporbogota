/**
 * Card Component
 * 
 * Reusable card component used across multiple sections.
 * Supports image, title, description, tags, and optional metadata.
 * Designed to be flexible: pass only what you need.
 */
import './Card.css'

export default function Card({ image, title, description, tags = [], meta, children, className = '' }) {
    return (
        <article className={`card ${className}`}>
            {image && (
                <div className="card__image-wrapper">
                    <img src={image} alt={title} className="card__image" loading="lazy" />
                </div>
            )}
            <div className="card__body">
                {title && <h3 className="card__title">{title}</h3>}
                {meta && <span className="card__meta">{meta}</span>}
                {description && <p className="card__description">{description}</p>}
                {tags.length > 0 && (
                    <div className="card__tags">
                        {tags.map((tag) => (
                            <span key={tag} className="card__tag">{tag}</span>
                        ))}
                    </div>
                )}
                {children}
            </div>
        </article>
    )
}
