import { apiClient } from './client'

import type {
  Ticket,
  TicketListParams,
  TicketCreate,
  TicketUpdate,
  ReplyCreate,
  Reply
} from '../types'
export const ticketApi = {
  // Create ticket
  async create(data: TicketCreate): Promise<Ticket> {
    const response = await apiClient.post<Ticket>('/tickets', data)
    return response.data
  },

  // Get ticket list
  async list(params?: TicketListParams): Promise<Ticket[]> {
    const response = await apiClient.get<Ticket[]>(
      '/tickets',
      { params }
    )

    return response.data
  },

  // Get ticket by ID
  async get(id: number): Promise<Ticket> {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`)
    return response.data
  },

  // Update ticket
  async update(id: number, data: TicketUpdate): Promise<Ticket> {
    const response = await apiClient.put<Ticket>(
      `/tickets/${id}`,
      data
    )
    return response.data
  },

  // Delete ticket
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/tickets/${id}`)
  },

  // Create reply
  async addReply(
    ticketId: number,
    data: ReplyCreate
  ): Promise<Reply> {
    const response = await apiClient.post<Reply>(
      `/tickets/${ticketId}/replies`,
      data
    )
    return response.data
  },

  // Get reply list
  async listReplies(ticketId: number): Promise<Reply[]> {
    const response = await apiClient.get<Reply[]>(
      `/tickets/${ticketId}/replies`
    )
    return response.data
  }
}
