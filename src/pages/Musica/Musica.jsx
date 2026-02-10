/**
 * Música Page
 * 
 * Showcases Bogotá's music culture with:
 * - Emerging artist profiles
 * - Spotify-style playlist placeholders
 * - Upcoming music event highlights
 */
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import Card from '../../components/Card/Card'
import musica from '../../data/musica.json'
import './Musica.css'

export default function Musica() {
    const { artists, playlists, events } = musica

    return (
        <div className="musica">
            <SectionHeader
                title="Música"
                subtitle="Descubre los sonidos que nacen en las calles, estudios y parques de Bogotá."
            />

            {/* Emerging artists */}
            <section className="musica__section">
                <h2 className="musica__subtitle">🎤 Artistas Emergentes</h2>
                <div className="musica__grid">
                    {artists.map((artist) => (
                        <Card
                            key={artist.id}
                            image={artist.image}
                            title={artist.name}
                            description={artist.description}
                            meta={artist.genre}
                            tags={[artist.locality]}
                        />
                    ))}
                </div>
            </section>

            {/* Playlists — Spotify-style placeholders */}
            <section className="musica__section">
                <h2 className="musica__subtitle">🎧 Playlists de Bogotá</h2>
                <div className="musica__playlists">
                    {playlists.map((pl) => (
                        <div key={pl.id} className="musica__playlist">
                            <div className="musica__playlist-icon">♫</div>
                            <div className="musica__playlist-info">
                                <h3>{pl.title}</h3>
                                <p>{pl.description}</p>
                                <span>{pl.trackCount} canciones · {pl.duration}</span>
                            </div>
                            <button className="btn btn--outline btn--sm" disabled>
                                ▶ Reproducir
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Music events */}
            <section className="musica__section">
                <h2 className="musica__subtitle">🎶 Próximos Eventos Musicales</h2>
                <div className="musica__events">
                    {events.map((event) => (
                        <div key={event.id} className="musica__event">
                            <div className="musica__event-date">
                                {new Date(event.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
                            </div>
                            <div className="musica__event-info">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <span className="musica__event-venue">📍 {event.venue}</span>
                                {event.free && <span className="musica__event-free">Gratis</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
