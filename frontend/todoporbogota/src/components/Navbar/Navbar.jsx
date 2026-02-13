/**
 * Navbar Component
 * 
 * Main navigation bar for todoporbogota.
 * Features a responsive hamburger menu for mobile devices
 * and horizontal navigation links for desktop.
 * Uses React Router's NavLink for active state styling.
 */
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/iniciativas', label: 'Iniciativas' },
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

                <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
                    {navLinks.map((link) => (
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
            </div>
        </nav>
    )
}
