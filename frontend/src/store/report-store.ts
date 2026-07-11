import { create } from "zustand";

export interface GeneratedReport {
  id: string;
  name: string;
  type: "PDF" | "Excel" | "CSV";
  size: string;
  status: "completed" | "processing" | "failed";
  createdAt: string;
  downloadUrl: string;
}

export interface ScheduledReport {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  format: "PDF" | "Excel" | "CSV";
  recipients: string[];
  isActive: boolean;
}

const INITIAL_REPORTS: GeneratedReport[] = [
  {
    id: "rep_901",
    name: "Q2_Sales_Executive_Summary",
    type: "PDF",
    size: "2.4 MB",
    status: "completed",
    createdAt: "2026-07-01T09:00:00Z",
    downloadUrl: "#",
  },
  {
    id: "rep_902",
    name: "Transaction_Logs_June_Full",
    type: "CSV",
    size: "18.1 KB",
    status: "completed",
    createdAt: "2026-07-02T11:30:00Z",
    downloadUrl: "#",
  },
  {
    id: "rep_903",
    name: "Inventory_Valuation_Report",
    type: "Excel",
    size: "112 KB",
    status: "completed",
    createdAt: "2026-07-05T15:20:00Z",
    downloadUrl: "#",
  },
];

const INITIAL_SCHEDULES: ScheduledReport[] = [
  {
    id: "sch_701",
    name: "Weekly Sales Performance Alert",
    frequency: "weekly",
    format: "PDF",
    recipients: ["executive-board@company.com"],
    isActive: true,
  },
  {
    id: "sch_702",
    name: "Daily Stock Out of Bounds Sync",
    frequency: "daily",
    format: "CSV",
    recipients: ["warehouse-ops@company.com", "purchase-officer@company.com"],
    isActive: true,
  },
];

interface ReportState {
  generatedReports: GeneratedReport[];
  scheduledReports: ScheduledReport[];
  isGenerating: boolean;
  generateReport: (name: string, type: "PDF" | "Excel" | "CSV") => Promise<void>;
  addSchedule: (schedule: ScheduledReport) => void;
  toggleSchedule: (id: string) => void;
  deleteReport: (id: string) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  generatedReports: INITIAL_REPORTS,
  scheduledReports: INITIAL_SCHEDULES,
  isGenerating: false,

  generateReport: async (name, type) => {
    set({ isGenerating: true });
    // Simulate compilation delay for high fidelity
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newReport: GeneratedReport = {
      id: `rep_${Date.now()}`,
      name: name.replace(/\s+/g, "_") || `SalesPulse_Report_${Date.now()}`,
      type,
      size: type === "PDF" ? "1.8 MB" : type === "Excel" ? "95 KB" : "8.4 KB",
      status: "completed",
      createdAt: new Date().toISOString(),
      downloadUrl: "#",
    };

    set((state) => ({
      generatedReports: [newReport, ...state.generatedReports],
      isGenerating: false,
    }));
  },

  addSchedule: (schedule) =>
    set((state) => ({
      scheduledReports: [schedule, ...state.scheduledReports],
    })),

  toggleSchedule: (id) =>
    set((state) => ({
      scheduledReports: state.scheduledReports.map((s) =>
        s.id === id ? { ...s, isActive: !s.isActive } : s
      ),
    })),

  deleteReport: (id) =>
    set((state) => ({
      generatedReports: state.generatedReports.filter((r) => r.id !== id),
    })),
}));
