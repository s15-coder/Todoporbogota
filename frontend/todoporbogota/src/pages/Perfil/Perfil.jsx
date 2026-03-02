import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import './Perfil.css'

export default function Perfil() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const apiBaseUrl = useMemo(() => import.meta.env.VITE_API_URL || '', [])

    useEffect(() => {
        const token = localStorage.getItem('authToken')

        if (!token) {
            setError('Debes iniciar sesión para ver tu perfil.')
            setLoading(false)
            return
        }

        const loadProfile = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/api/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error('No se pudo cargar el perfil')
                }

                const data = await response.json()
                setUser(data.user)
                setError('')
            } catch {
                setError('No se pudo cargar tu perfil. Intenta iniciar sesión nuevamente.')
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [apiBaseUrl])

    return (
        <div className="perfil">
            <SectionHeader
                title="Mi Perfil"
                subtitle="Información de tu cuenta obtenida desde el backend de Todo por Bogotá."
            />

            {loading && <p className="perfil__status">Cargando perfil...</p>}

            {!loading && error && (
                <div className="perfil__status-card">
                    <p className="perfil__status">{error}</p>
                    <Link to="/" className="btn btn--outline">Volver al inicio</Link>
                </div>
            )}

            {!loading && !error && user && (
                <section className="perfil__card">
                    <div className="perfil__avatar-wrap">
                        <img
                            src={user.avatar || '/identity/flag.png'}
                            alt={user.name ? `Perfil de ${user.name}` : 'Perfil de usuario'}
                            className="perfil__avatar"
                        />
                    </div>

                    <div className="perfil__info">
                        <div className="perfil__row">
                            <span className="perfil__label">Nombre</span>
                            <span className="perfil__value">{user.name || 'No disponible'}</span>
                        </div>

                        <div className="perfil__row">
                            <span className="perfil__label">Correo</span>
                            <span className="perfil__value">{user.email || 'No disponible'}</span>
                        </div>

                        <div className="perfil__row">
                            <span className="perfil__label">Rol</span>
                            <span className="perfil__value">{user.role || 'citizen'}</span>
                        </div>

                        <div className="perfil__row">
                            <span className="perfil__label">Miembro desde</span>
                            <span className="perfil__value">
                                {user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString('es-CO')
                                    : 'No disponible'}
                            </span>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}
