// store/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useDatasetStore } from "./dataset-store";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "viewer";
  picture?: string;
}

export interface RegisteredUser {
  password?: string;
  user: User;
  provider: "local" | "google";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: Record<string, RegisteredUser>;
  login: (email: string, password: string) => { success: boolean; error?: string };
  registerUser: (name: string, email: string, password?: string, provider?: "local" | "google") => { success: boolean; error?: string };
  loginWithGoogle: (email: string, name: string, picture?: string) => { success: boolean };
  logout: () => void;
}

// Demo credentials
const DEFAULT_USERS: Record<string, RegisteredUser> = {
  "admin@salespulse.ai": {
    password: "admin123",
    user: { id: "usr_001", email: "admin@salespulse.ai", name: "Admin User", role: "admin" },
    provider: "local",
  },
  "admin": {
    password: "admin123",
    user: { id: "usr_001", email: "admin@salespulse.ai", name: "Admin User", role: "admin" },
    provider: "local",
  },
  "demo@salespulse.ai": {
    password: "demo123",
    user: { id: "usr_002", email: "demo@salespulse.ai", name: "Demo User", role: "viewer" },
    provider: "local",
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: DEFAULT_USERS,

      login: (email, password) => {
        const emailKey = email.toLowerCase().trim();
        const users = get().users || DEFAULT_USERS;
        const entry = users[emailKey];
        if (entry && entry.password === password) {
          set({ user: entry.user, isAuthenticated: true });
          // Load user dataset workspace
          useDatasetStore.getState().loadUserWorkspace(entry.user.id);
          return { success: true };
        }
        return { success: false, error: "Invalid credentials. Try admin@salespulse.ai / admin123" };
      },

      registerUser: (name, email, password, provider = "local") => {
        const emailKey = email.toLowerCase().trim();
        const users = get().users || {};
        if (users[emailKey]) {
          return { success: false, error: "User already exists with this email address." };
        }

        const newUser: User = {
          id: `usr_${Math.random().toString(36).substring(2, 11)}`,
          email: emailKey,
          name,
          role: "viewer",
        };

        const updatedUsers = {
          ...users,
          [emailKey]: {
            password,
            user: newUser,
            provider,
          },
        };

        set({ users: updatedUsers, user: newUser, isAuthenticated: true });
        
        // Load/initialize user dataset workspace
        useDatasetStore.getState().loadUserWorkspace(newUser.id);
        
        return { success: true };
      },

      loginWithGoogle: (email, name, picture) => {
        const emailKey = email.toLowerCase().trim();
        const users = get().users || {};
        let targetUser = users[emailKey]?.user;

        const updatedUsers = { ...users };
        if (!targetUser) {
          // Provision new user details
          targetUser = {
            id: `usr_g_${Math.random().toString(36).substring(2, 11)}`,
            email: emailKey,
            name,
            role: "viewer",
            picture,
          };
        } else if (picture) {
          // Update picture if it changed
          targetUser = { ...targetUser, picture };
        }

        updatedUsers[emailKey] = {
          user: targetUser,
          provider: "google",
        };

        set({ users: updatedUsers, user: targetUser, isAuthenticated: true });
        
        // Load/initialize user dataset workspace
        useDatasetStore.getState().loadUserWorkspace(targetUser.id);
        
        return { success: true };
      },

      logout: () => {
        // Clear dataset workspace details first
        useDatasetStore.getState().clearWorkspace();
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

