import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketApi } from '../api/tickets'
import type { Ticket } from '../types'

function TicketList() {
  const navigate = useNavigate()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await ticketApi.list()
        setTickets(data)
      } catch (error) {
        console.error(error)
        setError('Failed to load tickets')
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [])

  if (loading) {
    return <p>Loading tickets...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div>
      <h1>Tickets</h1>

      <button onClick={() => navigate('/')}>
        Back Home
      </button>

      <button onClick={() => navigate('/tickets/new')}>
        Create Ticket
      </button>

      {tickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <button
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                #{ticket.id} — {ticket.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TicketList