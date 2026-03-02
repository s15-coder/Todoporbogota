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
import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
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
    const navigate = useNavigate()
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
    const [authLoading, setAuthLoading] = useState(false)
    const [authError, setAuthError] = useState('')
    const [user, setUser] = useState(null)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)
    const promptTimeoutRef = useRef(null)
    const profileMenuRef = useRef(null)

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const apiBaseUrl = useMemo(() => import.meta.env.VITE_API_URL || '', [])

    useEffect(() => {
        const savedToken = localStorage.getItem('authToken')
        const savedUser = localStorage.getItem('authUser')

        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch {
                localStorage.removeItem('authUser')
            }
        }

        if (!savedToken) {
            return
        }

        const loadCurrentUser = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${savedToken}`,
                    },
                })

                if (!response.ok) {
                    throw new Error('No se pudo validar la sesión')
                }

                const data = await response.json()
                setUser(data.user)
                localStorage.setItem('authUser', JSON.stringify(data.user))
            } catch {
                localStorage.removeItem('authToken')
                localStorage.removeItem('authUser')
                setUser(null)
            }
        }

        loadCurrentUser()
    }, [apiBaseUrl])

    useEffect(() => {
        if (!googleClientId) {
            return
        }

        const handleGoogleCredential = async (response) => {
            if (promptTimeoutRef.current) {
                clearTimeout(promptTimeoutRef.current)
                promptTimeoutRef.current = null
            }

            if (!response?.credential) {
                setAuthError('No se recibió token de Google')
                setAuthLoading(false)
                return
            }

            try {
                const loginResponse = await fetch(`${apiBaseUrl}/api/users/google-login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idToken: response.credential }),
                })

                if (!loginResponse.ok) {
                    throw new Error('No fue posible iniciar sesión')
                }

                const data = await loginResponse.json()
                localStorage.setItem('authToken', data.token)
                localStorage.setItem('authUser', JSON.stringify(data.user))
                setUser(data.user)
                setProfileMenuOpen(false)
                setAuthModalOpen(false)
                setAuthError('')
            } catch {
                setAuthError('Error al iniciar sesión con Google')
            } finally {
                setAuthLoading(false)
            }
        }

        window.handleGoogleCredential = handleGoogleCredential

        const initializeGoogle = () => {
            if (!window.google?.accounts?.id) {
                return
            }

            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleGoogleCredential,
            })
        }

        if (window.google?.accounts?.id) {
            initializeGoogle()
            return
        }

        const existingScript = document.querySelector('script[data-google-identity="true"]')
        if (existingScript) {
            existingScript.addEventListener('load', initializeGoogle)
            return () => existingScript.removeEventListener('load', initializeGoogle)
        }

        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.dataset.googleIdentity = 'true'
        script.addEventListener('load', initializeGoogle)
        document.head.appendChild(script)

        return () => {
            if (promptTimeoutRef.current) {
                clearTimeout(promptTimeoutRef.current)
                promptTimeoutRef.current = null
            }
            script.removeEventListener('load', initializeGoogle)
        }
    }, [apiBaseUrl, googleClientId])

    const handleGoogleLogin = () => {
        if (!googleClientId) {
            setAuthError('Falta configurar VITE_GOOGLE_CLIENT_ID')
            return
        }

        if (!window.google?.accounts?.id) {
            setAuthError('Google no está disponible, recarga la página')
            return
        }

        setAuthLoading(true)
        setAuthError('')

        if (promptTimeoutRef.current) {
            clearTimeout(promptTimeoutRef.current)
        }

        promptTimeoutRef.current = setTimeout(() => {
            setAuthLoading(false)
            setAuthError('No se pudo completar autenticación con Google')
            promptTimeoutRef.current = null
        }, 10000)

        window.google.accounts.id.prompt((notification) => {
            let isTerminalMoment = false

            if (notification?.isNotDisplayed?.()) {
                setAuthLoading(false)
                setAuthError('Google no mostró el selector de cuenta')
                isTerminalMoment = true
            }

            if (notification?.isSkippedMoment?.()) {
                setAuthLoading(false)
                setAuthError('No se completó el inicio de sesión con Google')
                isTerminalMoment = true
            }

            if (notification?.isDismissedMoment?.()) {
                setAuthLoading(false)
                isTerminalMoment = true
            }

            if (isTerminalMoment && promptTimeoutRef.current) {
                clearTimeout(promptTimeoutRef.current)
                promptTimeoutRef.current = null
            }
        })
    }

    const handleOpenAuthModal = () => {
        setAuthError('')
        setAuthModalOpen(true)
    }

    const handleCloseAuthModal = () => {
        if (authLoading) {
            return
        }

        setAuthModalOpen(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
        setUser(null)
        setProfileMenuOpen(false)
        setAuthError('')
    }

    const handleViewProfile = () => {
        setProfileMenuOpen(false)
        navigate('/perfil')
    }

    const toggleProfileMenu = () => {
        setAuthError('')
        setProfileMenuOpen((previous) => !previous)
    }

    useEffect(() => {
        if (!authModalOpen && !profileMenuOpen) {
            return
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                handleCloseAuthModal()
                setProfileMenuOpen(false)
            }
        }

        const handleDocumentClick = (event) => {
            if (!profileMenuRef.current?.contains(event.target)) {
                setProfileMenuOpen(false)
            }
        }

        window.addEventListener('keydown', handleEscape)
        window.addEventListener('mousedown', handleDocumentClick)

        return () => {
            window.removeEventListener('keydown', handleEscape)
            window.removeEventListener('mousedown', handleDocumentClick)
        }
    }, [authModalOpen, authLoading, profileMenuOpen])

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

                <div className="navbar__auth">
                    {user ? (
                        <div className="navbar__profile-menu" ref={profileMenuRef}>
                            <button
                                className="navbar__avatar-button"
                                onClick={toggleProfileMenu}
                                title="Opciones de perfil"
                                aria-label="Opciones de perfil"
                            >
                                <img
                                    src={user.avatar || '/identity/flag.png'}
                                    alt={user.name ? `Perfil de ${user.name}` : 'Perfil de usuario'}
                                    className="navbar__avatar"
                                />
                            </button>

                            {profileMenuOpen && (
                                <div className="navbar__profile-dropdown">
                                    <button className="navbar__profile-option" onClick={handleViewProfile}>
                                        Ver mi perfil
                                    </button>
                                    <button className="navbar__profile-option" onClick={handleLogout}>
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="navbar__auth-trigger" onClick={handleOpenAuthModal}>
                            <span className="navbar__auth-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" role="img" aria-label="Usuario">
                                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.31 0-6 2.02-6 4.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1c0-2.48-2.69-4.5-6-4.5Z" />
                                </svg>
                            </span>
                            <span>Regístrate o Ingresa</span>
                        </button>
                    )}
                </div>
            </div>

            {authModalOpen && !user && (
                <div className="navbar__auth-modal-overlay" onClick={handleCloseAuthModal}>
                    <div
                        className="navbar__auth-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Opciones de ingreso"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="navbar__auth-modal-close"
                            onClick={handleCloseAuthModal}
                            aria-label="Cerrar"
                            disabled={authLoading}
                        >
                            ✕
                        </button>

                        <h3 className="navbar__auth-modal-title">Opciones de ingreso</h3>

                        <button
                            className="navbar__auth-provider"
                            onClick={handleGoogleLogin}
                            disabled={authLoading}
                        >
                            <span className="navbar__auth-provider-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" role="img" aria-label="Google">
                                    <path d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2c1.9-1.8 3.1-4.4 3.1-7.5Z" />
                                    <path d="M12 22c2.7 0 4.9-.9 6.5-2.4l-3.2-2.6c-.9.6-2 .9-3.3.9-2.5 0-4.7-1.7-5.4-4h-3.3v2.6A10 10 0 0 0 12 22Z" />
                                    <path d="M6.6 13.9A6 6 0 0 1 6.3 12c0-.7.1-1.3.3-1.9V7.5H3.3A10 10 0 0 0 2 12c0 1.6.4 3.1 1.3 4.5l3.3-2.6Z" />
                                    <path d="M12 6.1c1.4 0 2.6.5 3.6 1.4l2.7-2.7A10 10 0 0 0 3.3 7.5l3.3 2.6c.7-2.3 2.9-4 5.4-4Z" />
                                </svg>
                            </span>
                            <span>{authLoading ? 'Conectando...' : 'Continuar con Google'}</span>
                        </button>

                        <button className="navbar__auth-provider navbar__auth-provider--disabled" disabled>
                            <span className="navbar__auth-provider-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" role="img" aria-label="Facebook">
                                    <path d="M14 8h3V4h-3c-3.1 0-5 1.9-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" />
                                </svg>
                            </span>
                            <span>Continuar con Facebook (próximamente)</span>
                        </button>
                    </div>
                </div>
            )}

            {authError && <p className="navbar__auth-error">{authError}</p>}
        </nav>
    )
}
