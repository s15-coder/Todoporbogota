/**
 * Layout Component
 * 
 * Wraps every route with a consistent layout:
 * - Sticky Navbar at the top
 * - Scrollable content area
 * - Footer at the bottom
 * 
 * Uses React Router's <Outlet> to render child routes.
 */
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import './Layout.css'

export default function Layout() {
    return (
        <div className="layout">
            <Navbar />
            <main className="layout__main">
                <div className="layout__container">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    )
}
