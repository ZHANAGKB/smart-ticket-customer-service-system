import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>AstraTickets</h1>
      <p>Customer service ticket management system</p>

      <button onClick={() => navigate('/tickets')}>
        View Tickets
      </button>

      <button onClick={() => navigate('/tickets/new')}>
        Create Ticket
      </button>
    </div>
  )
}

export default HomePage