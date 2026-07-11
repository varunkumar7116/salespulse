import { create } from "zustand";
import { SystemNotification } from "../types";

const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif_001",
    title: "Transactions File Processed",
    message: "ETL pipeline successfully validated and imported 7 transactional log entries from local CSV upload.",
    type: "success",
    isRead: false,
    module: "sales",
    createdAt: "2026-07-08T09:00:00Z",
  },
  {
    id: "notif_002",
    title: "Low Stock Alert: SP-AI-FC",
    message: "Stock for 'Real-time Forecasting Engine' has dropped below the minimum required levels (15 left).",
    type: "warning",
    isRead: false,
    module: "inventory",
    createdAt: "2026-07-08T08:15:00Z",
  },
  {
    id: "notif_003",
    title: "Critical Invoice Unpaid",
    message: "Invoice INV-2026-0003 for Apex Digital Solutions has passed its payment due date.",
    type: "error",
    isRead: true,
    module: "sales",
    createdAt: "2026-07-07T12:00:00Z",
  },
];

interface UiState {
  sidebarOpen: boolean;
  activeWorkspace: string;
  notifications: SystemNotification[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveWorkspace: (workspace: string) => void;
  addNotification: (notification: Omit<SystemNotification, "id" | "isRead" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  activeWorkspace: "Corporate Sales Hub",
  notifications: INITIAL_NOTIFICATIONS,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        {
          ...notif,
          id: `notif_${Date.now()}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
