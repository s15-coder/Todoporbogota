/**
 * Navbar Component
 * 
 * Main navigation bar for todoporbogota.
 * Features a responsive hamburger menu for mobile devices
 * and horizontal navigation links for desktop.
 */
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { getAdminMode, ADMIN_MODE_KEY, ADMIN_MODE_EVENT, getViewAsVisitor, VIEW_AS_VISITOR_KEY, VIEW_AS_VISITOR_EVENT } from '../../utils/adminMode'
import './Navbar.css'

const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/iniciativas', label: 'Iniciativas' },
    { to: '/moderacion', label: 'Moderación', adminOnly: true },
    { to: '/comunidad', label: 'Comunidad' },
    { to: '/musica', label: 'Música' },
    { to: '/historia', label: 'Historia' },
    { to: '/lugares', label: 'Lugares' },
    { to: '/agenda', label: 'Agenda' },
    { to: '/sostenible', label: 'Sostenible' },
    { to: '/opina', label: 'Opina' },
    { to: '/visual', label: 'Visual' },
]

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [adminMode, setAdminMode] = useState(false)
    const [viewAsVisitor, setViewAsVisitor] = useState(false)

    useEffect(() => {
        setAdminMode(getAdminMode())
        setViewAsVisitor(getViewAsVisitor())
    }, [])

    const toggleAdminMode = () => {
        const next = !adminMode
        try {
            localStorage.setItem(ADMIN_MODE_KEY, String(next))
            window.dispatchEvent(new CustomEvent(ADMIN_MODE_EVENT, { detail: next }))
        } catch {}
        setAdminMode(next)
    }

    const toggleViewAsVisitor = () => {
        const next = !viewAsVisitor
        try {
            localStorage.setItem(VIEW_AS_VISITOR_KEY, String(next))
            window.dispatchEvent(new CustomEvent(VIEW_AS_VISITOR_EVENT, { detail: next }))
        } catch {}
        setViewAsVisitor(next)
    }

    return (
        <nav className="navbar">
            <div className="navbar__container">
                <NavLink to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
                    <img src="/identity/flag.png" alt="todoporbogota logo" className="navbar__logo" />
                    <span className="navbar__title">todoporbogota</span>
                </NavLink>

                {/* Hamburger toggle for mobile */}
                <button
                    className={`navbar__toggle ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className="navbar__right">
                    <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
                        {navLinks
                            .filter((link) => !link.adminOnly || adminMode)
                            .map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}
                                    onClick={() => setMenuOpen(false)}
                                    end={link.to === '/'}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        className={`navbar__visitor-btn ${viewAsVisitor ? 'navbar__visitor-btn--on' : ''}`}
                        onClick={toggleViewAsVisitor}
                        title={viewAsVisitor ? 'Ver iniciativas como propias' : 'Ver iniciativas como visitante (como si no fueran tuyas)'}
                        aria-pressed={viewAsVisitor}
                    >
                        {viewAsVisitor ? 'Como visitante ✓' : 'Ver como visitante'}
                    </button>
                    <button
                        type="button"
                        className={`navbar__admin-btn ${adminMode ? 'navbar__admin-btn--on' : ''}`}
                        onClick={toggleAdminMode}
                        title={adminMode ? 'Salir del modo admin' : 'Activar modo admin'}
                        aria-pressed={adminMode}
                    >
                        {adminMode ? 'Admin ✓' : 'Modo admin'}
                    </button>
                </div>
            </div>
        </nav>
    )
}
