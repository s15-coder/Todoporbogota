/**
 * Home Page
 * 
 * Landing page for todoporbogota.
 * Features a hero section with the brand message,
 * highlighted initiatives, music section, and featured places.
 * Acts as the entry point inviting users to explore the platform.
 */
import { Link } from 'react-router-dom'
import Card from '../../components/Card/Card'
import iniciativas from '../../data/iniciativas.json'
import musica from '../../data/musica.json'
import lugares from '../../data/lugares.json'
import './Home.css'

// Show featured items on the home page
const featuredIniciativas = iniciativas.filter((i) => i.featured).slice(0, 2)
const featuredArtists = musica.artists.filter((a) => a.featured).slice(0, 2)
const featuredLugares = lugares.filter((l) => l.recommended).slice(0, 3)

export default function Home() {
    return (
        <div className="home">
            {/* Hero section — first impression, sets the tone */}
            <section className="home__hero">
                <div className="home__hero-content">
                    <h1 className="home__hero-title">
                        Todo por <span className="home__highlight">Bogotá</span>
                    </h1>
                    <p className="home__hero-subtitle">
                        Una plataforma comunitaria para celebrar la cultura, impulsar iniciativas ciudadanas
                        y conectar con la ciudad que amamos.
                    </p>
                    <div className="home__hero-actions">
                        <Link to="/iniciativas" className="btn btn--primary">Explorar Iniciativas</Link>
                        <Link to="/comunidad" className="btn btn--outline">Conoce la Comunidad</Link>
                    </div>
                </div>
                <div className="home__hero-visual">
                    <img src="/src/assets/identity/coat_of_arms.png" alt="Escudo de Bogotá" className="home__coat" />
                </div>
            </section>

            {/* Featured initiatives */}
            <section className="home__section">
                <div className="home__section-header">
                    <h2>Iniciativas Destacadas</h2>
                    <Link to="/iniciativas" className="home__see-all">Ver todas →</Link>
                </div>
                <div className="home__grid home__grid--2">
                    {featuredIniciativas.map((item) => (
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
            </section>

            {/* Music spotlight */}
            <section className="home__section">
                <div className="home__section-header">
                    <h2>Suena Bogotá 🎵</h2>
                    <Link to="/musica" className="home__see-all">Descubrir más →</Link>
                </div>
                <div className="home__grid home__grid--2">
                    {featuredArtists.map((artist) => (
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

            {/* Featured places */}
            <section className="home__section">
                <div className="home__section-header">
                    <h2>Lugares Recomendados</h2>
                    <Link to="/lugares" className="home__see-all">Ver todos →</Link>
                </div>
                <div className="home__grid home__grid--3">
                    {featuredLugares.map((place) => (
                        <Card
                            key={place.id}
                            image={place.image}
                            title={place.name}
                            description={place.description}
                            meta={place.category}
                            tags={place.tags}
                        />
                    ))}
                </div>
            </section>

            {/* Call to action */}
            <section className="home__cta">
                <h2>¿Tienes una iniciativa para Bogotá?</h2>
                <p>Únete a nuestra comunidad y comparte tus ideas, proyectos y sueños para la ciudad.</p>
                <Link to="/opina" className="btn btn--primary">Participa Ahora</Link>
            </section>
        </div>
    )
}
