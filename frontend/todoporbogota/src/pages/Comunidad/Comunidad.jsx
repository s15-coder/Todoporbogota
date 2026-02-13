/**
 * Comunidad Page
 * 
 * Showcases inspiring citizens, artists, and collectives.
 * Uses profile cards with photo, name, role, and story preview.
 */
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import Card from '../../components/Card/Card'
import comunidad from '../../data/comunidad.json'
import './Comunidad.css'

export default function Comunidad() {
    return (
        <div className="comunidad">
            <SectionHeader
                title="Comunidad"
                subtitle="Historias y entrevistas cortas de ciudadanos, artistas y colectivos que inspiran a Bogotá."
            />

            <div className="comunidad__grid">
                {comunidad.map((person) => (
                    <Card
                        key={person.id}
                        image={person.photo}
                        title={person.name}
                        description={person.story}
                        meta={person.role}
                        tags={person.tags}
                    >
                        <span className="comunidad__locality">📍 {person.locality}</span>
                    </Card>
                ))}
            </div>
        </div>
    )
}
