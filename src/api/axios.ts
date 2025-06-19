import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/auth";
import { AuthService } from "../services/auth.services";

const axiosRequestConfig = {
  baseURL: "https://api.escuelajs.co/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  retry: 10,
};

export const api = axios.create(axiosRequestConfig);

function getTokenExp(token: string): number | null {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

let refreshingPromise: Promise<any> | null = null;

api.interceptors.request.use(async (config) => {
  const { tokens, setTokens } = useAuthStore.getState();
  let access_token = tokens?.access_token;
  const refresh_token = tokens?.refresh_token;

  if (access_token) {
    const exp = getTokenExp(access_token);
    const now = Date.now();

    // If token expires in less than 5 minutes, refresh it
    if (exp && exp - now < 5 * 60_000 && refresh_token) {
      // Avoid multiple concurrent refreshes
      if (!refreshingPromise) {
        refreshingPromise = AuthService.refreshToken(refresh_token)
          .then((newTokens) => {
            setTokens(newTokens);
            access_token = newTokens.access_token;
            return newTokens;
          })
          .finally(() => {
            refreshingPromise = null;
          });
      }

      // Wait for the refresh to finish
      await refreshingPromise;
    }

    // Update the token after possible refresh
    access_token = useAuthStore.getState().tokens?.access_token;

    if (config.headers && typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${access_token}`);
    } else {
      (config.headers as any).Authorization = `Bearer ${access_token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    return Promise.reject(err);
  },
);
