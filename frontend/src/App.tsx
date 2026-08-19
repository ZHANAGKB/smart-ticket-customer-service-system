import { useEffect, useState } from 'react'
import { ticketApi } from './api/tickets'
import type { Ticket } from './types'
import { Route, Routes } from 'react-router-dom'
import TicketList from './pages/TicketList'
import HomePage from './pages/Home'
import CreateTicket from './pages/CreateTicket'
import TicketDetail from './pages/TicketDetail'

function App() {
  return (
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
  )
}

export default App