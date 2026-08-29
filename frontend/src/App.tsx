import { Route, Routes } from 'react-router-dom'
import TicketList from './pages/TicketList'
import HomePage from './pages/Home'
import CreateTicket from './pages/CreateTicket'
import TicketDetail from './pages/TicketDetail'
import AppLayout from './components/AppLayout'

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />}/>

        <Route
        path="/tickets"
        element={<TicketList />}
        />
        <Route
          path="/tickets/new"
          element={<CreateTicket />}
        />

        <Route
          path="/tickets/:id"
          element={<TicketDetail />}
        />

      </Routes>
    </AppLayout>
  )
}

export default App
