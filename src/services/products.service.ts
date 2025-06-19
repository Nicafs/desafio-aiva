import { api } from "../api/axios";
import { type ApiProduct } from "../types/ApiProduct";

export const ProductsService = {
  async getAll() {
    const response = await api.get<ApiProduct[]>("/products");
    return response.data;
  },

  async getById(id: number) {
    const response = await api.get<ApiProduct>(`/products/${id}`);
    return response.data;
  },

  async create(product: Partial<ApiProduct>) {
    const response = await api.post("/products", product);
    return response.data;
  },

  async update(id: number, product: Partial<ApiProduct>) {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  async remove(id: number) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
