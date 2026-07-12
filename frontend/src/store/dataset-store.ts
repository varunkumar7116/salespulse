// store/dataset-store.ts
// Manages uploaded datasets, cleaning reports, profiles, and analytics

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CleanedRow, CleaningReport, DataProfile, KPIs, SalesAnalytics,
  ProductAnalytics, CustomerAnalytics, ProfitAnalytics, InventoryAnalytics,
  ForecastResult, computeKPIs, computeSalesAnalytics, computeProductAnalytics,
  computeCustomerAnalytics, computeProfitAnalytics, computeInventoryAnalytics,
  computeForecast
} from "../lib/data-processor";
import { BusinessInsights, generateInsights } from "../lib/ai-insights";

export interface Dataset {
  id: string;
  name: string;
  originalName: string;
  uploadedAt: string;
  rows: number;
  columns: number;
  sizeBytes: number;
  status: "processing" | "ready" | "error";
  report?: CleaningReport;
  profile?: DataProfile;
  rowsData?: CleanedRow[];
}

interface DatasetState {
  datasets: Dataset[];
  activeDatasetId: string | null;
  rows: CleanedRow[];
  kpis: KPIs | null;
  sales: SalesAnalytics | null;
  products: ProductAnalytics | null;
  customers: CustomerAnalytics | null;
  profit: ProfitAnalytics | null;
  inventory: InventoryAnalytics | null;
  forecast: ForecastResult | null;
  insights: BusinessInsights | null;
  isProcessing: boolean;
  processingStep: string;
  uploadProgress: number;
  error: string | null;

  addDataset: (dataset: Dataset, rows: CleanedRow[], report: CleaningReport, profile: DataProfile) => void;
  setActiveDataset: (id: string) => void;
  removeDataset: (id: string) => void;
  computeAnalytics: () => void;
  setProgress: (pct: number, step: string) => void;
  clearError: () => void;
}

export const useDatasetStore = create<DatasetState>()(
  persist(
    (set, get) => ({
      datasets: [],
      activeDatasetId: null,
      rows: [],
      kpis: null,
      sales: null,
      products: null,
      customers: null,
      profit: null,
      inventory: null,
      forecast: null,
      insights: null,
      isProcessing: false,
      processingStep: "",
      uploadProgress: 0,
      error: null,

      addDataset: (dataset, rows, report, profile) => {
        const updated = { ...dataset, status: "ready" as const, report, profile, rowsData: rows };
        set((state) => ({
          datasets: [updated, ...state.datasets.filter(d => d.id !== dataset.id)],
          activeDatasetId: dataset.id,
          rows,
          isProcessing: false,
          uploadProgress: 100,
        }));
        get().computeAnalytics();
      },

      setActiveDataset: (id) => {
        const target = get().datasets.find(d => d.id === id);
        if (target && target.rowsData) {
          set({ activeDatasetId: id, rows: target.rowsData });
        } else {
          set({ activeDatasetId: id });
        }
        get().computeAnalytics();
      },

      removeDataset: (id) => {
        set((state) => {
          const remaining = state.datasets.filter((d) => d.id !== id);
          const newActive = state.activeDatasetId === id ? (remaining[0]?.id || null) : state.activeDatasetId;
          return {
            datasets: remaining,
            activeDatasetId: newActive,
            ...(newActive === null ? { rows: [], kpis: null, sales: null, products: null, customers: null, profit: null, inventory: null, forecast: null, insights: null } : {}),
          };
        });
      },

      computeAnalytics: () => {
        const { rows } = get();
        if (!rows || rows.length === 0) return;
        try {
          const kpis = computeKPIs(rows);
          const sales = computeSalesAnalytics(rows);
          const products = computeProductAnalytics(rows);
          const customers = computeCustomerAnalytics(rows);
          const profit = computeProfitAnalytics(rows);
          const inventory = computeInventoryAnalytics(rows);
          const forecast = computeForecast(rows);
          const insights = generateInsights(kpis, sales, products, customers, profit, inventory);
          set({ kpis, sales, products, customers, profit, inventory, forecast, insights });
        } catch (e) {
          console.error("Analytics computation failed:", e);
        }
      },

      setProgress: (pct, step) => set({ uploadProgress: pct, processingStep: step, isProcessing: pct < 100 }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "salespulse-datasets",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const parsed = JSON.parse(str);
            if (parsed.state) {
              // Revive Date objects in state.rows
              if (Array.isArray(parsed.state.rows)) {
                parsed.state.rows = parsed.state.rows.map((row: any) => ({
                  ...row,
                  order_date: row.order_date ? new Date(row.order_date) : new Date()
                }));
              }
              // Revive Date objects in state.datasets[...].rowsData
              if (Array.isArray(parsed.state.datasets)) {
                parsed.state.datasets = parsed.state.datasets.map((d: any) => {
                  if (Array.isArray(d.rowsData)) {
                    return {
                      ...d,
                      rowsData: d.rowsData.map((row: any) => ({
                        ...row,
                        order_date: row.order_date ? new Date(row.order_date) : new Date()
                      }))
                    };
                  }
                  return d;
                });
              }
            }
            return parsed;
          } catch (e) {
            console.error("Failed to parse persisted dataset store:", e);
            return null;
          }
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);
