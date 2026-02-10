/**
 * Bogotá Sostenible Page
 * 
 * Environmental initiatives, urban gardens, recycling, sustainable mobility.
 * Features initiative cards and practical sustainability tips.
 */
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import Card from '../../components/Card/Card'
import sostenible from '../../data/sostenible.json'
import './Sostenible.css'

export default function Sostenible() {
    const { initiatives, tips } = sostenible

    return (
        <div className="sostenible">
            <SectionHeader
                title="Bogotá Sostenible"
                subtitle="Iniciativas ambientales, huertas urbanas, reciclaje y movilidad sostenible. Construyamos una Bogotá más verde."
            />

            {/* Environmental initiatives */}
            <section className="sostenible__section">
                <h2 className="sostenible__subtitle">🌿 Iniciativas Ambientales</h2>
                <div className="sostenible__grid">
                    {initiatives.map((item) => (
                        <Card
                            key={item.id}
                            image={item.image}
                            title={item.title}
                            description={item.description}
                            meta={item.category}
                        >
                            <div className="sostenible__impact">
                                <span>📊 Impacto: {item.impact}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Tips section */}
            <section className="sostenible__section">
                <h2 className="sostenible__subtitle">💡 Tips para una Bogotá Sostenible</h2>
                <div className="sostenible__tips">
                    {tips.map((tip) => (
                        <div key={tip.id} className="sostenible__tip">
                            <span className="sostenible__tip-icon">{tip.icon}</span>
                            <div>
                                <h3>{tip.title}</h3>
                                <p>{tip.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
