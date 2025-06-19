import { api } from "../api/axios";
import { type ApiUser } from "../types/ApiUser";

export const UsersService = {
  async getAll() {
    const response = await api.get<ApiUser[]>("/users");
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get<ApiUser>(`/users/${id}`);
    return response.data;
  },

  async create(data: Partial<ApiUser>) {
    const response = await api.post("/users", data);
    return response.data;
  },

  async update(id: number, data: Partial<ApiUser>) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async remove(id: number) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
