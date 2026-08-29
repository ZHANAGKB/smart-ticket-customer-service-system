

export type TicketStatus = 
    | 'open'
    | 'in_progress'
    | 'resolved'
    | 'closed'

export type TicketPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent'


export interface User{
  id: number
  email: string
  name?: string | null
  created_at: string
}

export interface UserCreate {
    email: string
    name?: string | null
}

// ticket read schmema for backend
export interface Ticket {
  id: number
  title: string
  content: string
  tags: string | null
  status: TicketStatus | null
  priority: TicketPriority | null
  requester_id: number
  created_at: string | null
  updated_at: string | null
}


export interface TicketCreate {
    title: string
    content: string
    tags?: string | null
    status?: TicketStatus | null
    priority?: TicketPriority | null
    requester_id: number
}


export interface TicketUpdate {
  title?: string | null
  content?: string | null
  status?: TicketStatus | null
  priority?: TicketPriority | null
  tags?: string | null
}

export interface Reply {
  id: number
  ticket_id: number
  author_id: number
  content: string
  updated_at: string
}

export interface ReplyCreate {
  author_id: number
  content: string
}

export interface TicketListParams {
  status?: TicketStatus
  priority?: TicketPriority
}