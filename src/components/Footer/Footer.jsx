/**
 * Footer Component
 * 
 * Site-wide footer with branding, quick links, and credits.
 * Reflects the community-driven spirit of the project.
 */
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__brand">
                    <img src="/identity/flag.png" alt="todoporbogota logo" className="footer__logo" />
                    <h3>todoporbogota</h3>
                    <p>Una plataforma comunitaria para celebrar, transformar y conectar con Bogotá.</p>
                </div>

                <div className="footer__links">
                    <h4>Explorar</h4>
                    <Link to="/iniciativas">Iniciativas</Link>
                    <Link to="/comunidad">Comunidad</Link>
                    <Link to="/musica">Música</Link>
                    <Link to="/lugares">Lugares</Link>
                    <Link to="/agenda">Agenda</Link>
                </div>

                <div className="footer__links">
                    <h4>Participar</h4>
                    <Link to="/opina">Opina Bogotá</Link>
                    <Link to="/sostenible">Bogotá Sostenible</Link>
                    <Link to="/visual">Bogotá Visual</Link>
                    <Link to="/historia">Nuestra Historia</Link>
                </div>

                <div className="footer__social">
                    <h4>Conecta</h4>
                    <p>¿Tienes una historia, iniciativa o foto de Bogotá? ¡Queremos conocerla!</p>
                    <a href="mailto:hola@todoporbogota.co" className="footer__cta">
                        hola@todoporbogota.co
                    </a>
                </div>
            </div>

            <div className="footer__bottom">
                <p>Hecho con ❤️ por y para Bogotá · 2026</p>
            </div>
        </footer>
    )
}
