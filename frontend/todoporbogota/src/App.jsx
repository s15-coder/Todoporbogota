/**
 * App.jsx — Root Application Component
 * 
 * Architecture decisions:
 * - React Router with BrowserRouter for client-side routing
 * - Layout component wraps all routes (shared Navbar + Footer)
 * - Each page is a separate route component
 * - Clean separation: pages/ for routes, components/ for reusables, data/ for mocks
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home/Home'
import Iniciativas from './pages/Iniciativas/Iniciativas'
import Comunidad from './pages/Comunidad/Comunidad'
import Musica from './pages/Musica/Musica'
import Historia from './pages/Historia/Historia'
import Lugares from './pages/Lugares/Lugares'
import Agenda from './pages/Agenda/Agenda'
import Sostenible from './pages/Sostenible/Sostenible'
import Opina from './pages/Opina/Opina'
import Visual from './pages/Visual/Visual'
import PostularIniciativa from './pages/PostularIniciativa/PostularIniciativa'
import MisPropuestas from './pages/MisPropuestas/MisPropuestas'
import EditarPropuesta from './pages/EditarPropuesta/EditarPropuesta'
import Moderacion from './pages/Moderacion/Moderacion'
import ModeracionConversacion from './pages/ModeracionConversacion/ModeracionConversacion'
import VerConversacion from './pages/VerConversacion/VerConversacion'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wraps all routes with Navbar + Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/iniciativas" element={<Iniciativas />} />
          <Route path="/iniciativas/postular" element={<PostularIniciativa />} />
          <Route path="/iniciativas/mis-propuestas" element={<MisPropuestas />} />
          <Route path="/iniciativas/mis-propuestas/editar" element={<EditarPropuesta />} />
          <Route path="/iniciativas/mis-propuestas/ver/:id" element={<VerConversacion />} />
          <Route path="/moderacion" element={<Moderacion />} />
          <Route path="/moderacion/:id" element={<ModeracionConversacion />} />
          <Route path="/comunidad" element={<Comunidad />} />
          <Route path="/musica" element={<Musica />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/lugares" element={<Lugares />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/sostenible" element={<Sostenible />} />
          <Route path="/opina" element={<Opina />} />
          <Route path="/visual" element={<Visual />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
