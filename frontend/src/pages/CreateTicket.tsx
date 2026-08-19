import { useNavigate } from "react-router-dom";

function CreateTicket() {
    const navigate = useNavigate()

    return (
        <div>
            <h1>
                Create  Ticket
            </h1>
            <p>
                The tikcet creation form will be added later.
            </p>

            <button onClick={() => navigate('/tickets')}>
                Back to Tickets
            </button>
        </div>
    )
}

export default CreateTicket