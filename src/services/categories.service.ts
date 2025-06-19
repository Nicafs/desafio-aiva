import { api } from "../api/axios";
import { type ApiCategory } from "../types/ApiCategory";

export const CategoriesService = {
  async getAll() {
    const response = await api.get<ApiCategory[]>("/categories");
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<ApiCategory>(`/categories/${id}`);
    return response.data;
  },

  async create(data: Partial<ApiCategory>) {
    const response = await api.post("/categories", data);
    return response.data;
  },

  async update(id: string, data: Partial<ApiCategory>) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  async remove(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
