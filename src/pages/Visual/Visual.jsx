/**
 * Bogotá Visual Page
 * 
 * Photo gallery of the city with masonry-style layout.
 * Supports user-submitted content (mocked for now).
 * Clicking a photo opens a lightbox-style preview.
 */
import { useState } from 'react'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import visual from '../../data/visual.json'
import './Visual.css'

export default function Visual() {
    const [selected, setSelected] = useState(null)

    return (
        <div className="visual">
            <SectionHeader
                title="Bogotá Visual"
                subtitle="La ciudad a través del lente de su gente. Fotografías que capturan la esencia de Bogotá."
            />

            {/* Upload CTA (mocked) */}
            <div className="visual__upload">
                <p>📸 ¿Tienes una foto increíble de Bogotá?</p>
                <button className="btn btn--outline" disabled>
                    Subir Foto (Próximamente)
                </button>
            </div>

            {/* Photo gallery grid */}
            <div className="visual__gallery">
                {visual.map((photo) => (
                    <figure
                        key={photo.id}
                        className="visual__item"
                        onClick={() => setSelected(photo)}
                    >
                        <img src={photo.image} alt={photo.title} loading="lazy" />
                        <figcaption className="visual__caption">
                            <strong>{photo.title}</strong>
                            <span>📍 {photo.location}</span>
                        </figcaption>
                    </figure>
                ))}
            </div>

            {/* Lightbox */}
            {selected && (
                <div className="visual__lightbox" onClick={() => setSelected(null)}>
                    <div className="visual__lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <button className="visual__lightbox-close" onClick={() => setSelected(null)}>✕</button>
                        <img src={selected.image} alt={selected.title} />
                        <div className="visual__lightbox-info">
                            <h3>{selected.title}</h3>
                            <p>Por {selected.author} · 📍 {selected.location}</p>
                            <div className="visual__lightbox-tags">
                                {selected.tags.map((tag) => (
                                    <span key={tag} className="visual__tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
