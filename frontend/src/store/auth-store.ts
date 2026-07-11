// store/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "viewer";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

// Demo credentials
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@salespulse.ai": {
    password: "admin123",
    user: { id: "usr_001", email: "admin@salespulse.ai", name: "Admin User", role: "admin" },
  },
  "admin": {
    password: "admin123",
    user: { id: "usr_001", email: "admin@salespulse.ai", name: "Admin User", role: "admin" },
  },
  "demo@salespulse.ai": {
    password: "demo123",
    user: { id: "usr_002", email: "demo@salespulse.ai", name: "Demo User", role: "viewer" },
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        const entry = DEMO_USERS[email.toLowerCase().trim()];
        if (entry && entry.password === password) {
          set({ user: entry.user, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: "Invalid credentials. Try admin@salespulse.ai / admin123" };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        if (typeof window !== "undefined") {
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          window.location.href = "/login";
        }
      },
    }),
    { name: "salespulse-auth" }
  )
);
