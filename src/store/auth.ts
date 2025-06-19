import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApiUser } from "../types/ApiUser";

type AuthTokens = {
  access_token: string;
  refresh_token: string;
} | null;

type AuthStore = {
  tokens: AuthTokens;
  user: ApiUser | null;
  loginDate: Date | null;
  setTokens: (tokens: AuthTokens) => void;
  setUser: (user: ApiUser | null) => void;
  signOut: () => void;
};

const initialState = {
  tokens: null,
  user: null,
  loginDate: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setTokens: (tokens) => {
        set({ tokens, loginDate: new Date() });
      },

      setUser: (user) => {
        set({ user });
      },

      signOut: () => {
        set(initialState);
      },
    }),
    {
      name: "auth-aiva", // Storage key in localStorage
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        loginDate: state.loginDate,
      }),
    },
  ),
);

const tokens = localStorage.getItem("tokens");
const user = localStorage.getItem("user");

if (tokens) {
  useAuthStore.getState().setTokens(JSON.parse(tokens));
}
if (user) {
  useAuthStore.getState().setUser(JSON.parse(user));
}
