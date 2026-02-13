/**
 * Opina Bogotá Page
 * 
 * Polls and short community questions with simple discussion prompts.
 * Poll results are mocked — voting updates local state only.
 */
import { useState } from 'react'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import opinaData from '../../data/opina.json'
import './Opina.css'

export default function Opina() {
    // Local state for polls — allows "voting" in the UI
    const [polls, setPolls] = useState(opinaData.polls)
    const [voted, setVoted] = useState({})

    const handleVote = (pollId, optionId) => {
        if (voted[pollId]) return // Already voted

        setPolls((prev) =>
            prev.map((poll) => {
                if (poll.id !== pollId) return poll
                return {
                    ...poll,
                    totalVotes: poll.totalVotes + 1,
                    options: poll.options.map((opt) =>
                        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
                    ),
                }
            })
        )
        setVoted((prev) => ({ ...prev, [pollId]: optionId }))
    }

    return (
        <div className="opina">
            <SectionHeader
                title="Opina Bogotá"
                subtitle="Tu voz importa. Participa en encuestas y comparte tu opinión sobre la ciudad."
            />

            {/* Polls */}
            <section className="opina__section">
                <h2 className="opina__subtitle">📊 Encuestas</h2>
                <div className="opina__polls">
                    {polls.map((poll) => (
                        <div key={poll.id} className="opina__poll">
                            <h3>{poll.question}</h3>
                            <div className="opina__options">
                                {poll.options.map((opt) => {
                                    const pct = Math.round((opt.votes / poll.totalVotes) * 100)
                                    const hasVoted = voted[poll.id]
                                    const isSelected = voted[poll.id] === opt.id

                                    return (
                                        <button
                                            key={opt.id}
                                            className={`opina__option ${hasVoted ? 'opina__option--voted' : ''} ${isSelected ? 'opina__option--selected' : ''}`}
                                            onClick={() => handleVote(poll.id, opt.id)}
                                            disabled={!!hasVoted}
                                        >
                                            <span className="opina__option-text">{opt.text}</span>
                                            {hasVoted && (
                                                <span className="opina__option-pct">{pct}%</span>
                                            )}
                                            {hasVoted && (
                                                <div
                                                    className="opina__option-bar"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            <span className="opina__total">{poll.totalVotes} votos</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Discussion prompts */}
            <section className="opina__section">
                <h2 className="opina__subtitle">💬 Temas de Conversación</h2>
                <div className="opina__discussions">
                    {opinaData.discussions.map((disc) => (
                        <div key={disc.id} className="opina__discussion">
                            <p className="opina__prompt">{disc.prompt}</p>
                            <span className="opina__responses">{disc.responses} respuestas</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
