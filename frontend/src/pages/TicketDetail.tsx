import { useParams, useNavigate } from 'react-router-dom'

function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div>
      <h1>Ticket Detail</h1>
      <p>Current ticket ID: {id}</p>

      <button onClick={() => navigate('/tickets')}>
        Back to Tickets
      </button>
    </div>
  )
}

export default TicketDetail