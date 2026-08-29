import { apiClient } from "./client";
import type {User, UserCreate} from "../types";

export const userApi = {
    async create(data: UserCreate): Promise<User> {
        const response = await apiClient.post<User>('/users', data)
        return response.data
    },

    async list(): Promise<User[]> {
        const response = await apiClient.get<User[]>('/users')
        return response.data
    },

    async get(id: number): Promise<User> {
        const response = await apiClient.get<User>(`/users/${id}`)
        return response.data
    }
}