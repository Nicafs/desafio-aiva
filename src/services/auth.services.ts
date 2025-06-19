import { api } from "../api/axios";

export const AuthService = {
  async login({ email, password }: { email: string; password: string }) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    return response.data;
  },

  async profile() {
    const response = await api.get(`/auth/profile`);
    return response.data;
  },

  async refreshToken(refresh_token: string) {
    const response = await api.post(`/auth/refresh-token`, {
      refreshToken: refresh_token,
    });
    return response.data;
  },
};
