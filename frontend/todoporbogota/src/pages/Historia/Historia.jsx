/**
 * Nuestra Historia Page
 * 
 * Interactive timeline of Bogotá's history featuring
 * key moments, lesser-known stories, and urban legends.
 * Uses the reusable Timeline component.
 */
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import Timeline from '../../components/Timeline/Timeline'
import historia from '../../data/historia.json'
import './Historia.css'

export default function Historia() {
    return (
        <div className="historia">
            <SectionHeader
                title="Nuestra Historia"
                subtitle="Un recorrido por los momentos que han definido a Bogotá — desde su fundación hasta el presente, incluyendo las historias que pocos conocen."
            />

            <div className="historia__legend">
                <span className="historia__legend-item">
                    <span className="historia__dot historia__dot--main"></span> Momento histórico
                </span>
                <span className="historia__legend-item">
                    <span className="historia__dot historia__dot--special"></span> Historia poco conocida / Leyenda urbana
                </span>
            </div>

            <Timeline events={historia} />
        </div>
    )
}
