import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000
})

export interface HealthResponse {
  status: string
  environment: string
}

export const fetchHealth = async () => {
  const response = await apiClient.get<HealthResponse>('/health')
  return response.data
}
