/**
 * Timeline Component
 * 
 * Interactive vertical timeline used in Nuestra Historia page.
 * Each event is displayed with a year marker, title, and description.
 * Lesser-known stories and urban legends are visually distinguished.
 */
import './Timeline.css'

export default function Timeline({ events }) {
    return (
        <div className="timeline">
            {events.map((event) => (
                <div
                    key={event.id}
                    className={`timeline__item ${event.lesserKnown ? 'timeline__item--special' : ''}`}
                >
                    <div className="timeline__marker">
                        <span className="timeline__year">{event.year}</span>
                        <div className="timeline__dot" />
                    </div>
                    <div className="timeline__content">
                        <span className="timeline__type">{event.type}</span>
                        <h3 className="timeline__title">{event.title}</h3>
                        <p className="timeline__description">{event.description}</p>
                        {event.lesserKnown && (
                            <span className="timeline__badge">✨ Historia poco conocida</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
