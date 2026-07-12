"use client";
// components/layout/topbar.tsx

import { useState } from "react";
import { Bell, Search, ChevronDown, Database, Check, RefreshCw } from "lucide-react";
import { useDatasetStore } from "@/store/dataset-store";
import { useAuthStore } from "@/store/auth-store";
import { formatNumber } from "@/lib/data-processor";

export default function Topbar({ title }: { title?: string }) {
  const { datasets, activeDatasetId, setActiveDataset, kpis } = useDatasetStore();
  const { user } = useAuthStore();
  const [datasetOpen, setDatasetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const activeDataset = datasets.find((d) => d.id === activeDatasetId);

  const notifications = [
    { id: 1, type: "success", message: "Data cleaning completed", time: "2m ago" },
    { id: 2, type: "warning", message: "3 products below reorder level", time: "5m ago" },
    { id: 3, type: "info", message: "AI insights ready", time: "10m ago" },
  ];

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-4 gap-4 sticky top-0 z-30 shrink-0">
      {/* Title */}
      {title && (
        <div className="hidden md:block">
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Dataset Selector */}
      {datasets.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setDatasetOpen(!datasetOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground hover:bg-muted transition-all"
          >
            <Database className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="max-w-[140px] truncate text-xs font-medium">
              {activeDataset?.name || "Select Dataset"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {datasetOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 glass rounded-xl border border-border shadow-lg z-50 overflow-hidden animate-scale-in">
              <div className="p-2 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground px-2 py-1">DATASETS</p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {datasets.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => { setActiveDataset(d.id); setDatasetOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                  >
                    {d.id === activeDatasetId && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                    <div className={d.id !== activeDatasetId ? "ml-5" : ""}>
                      <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{formatNumber(d.rows)} rows • {d.uploadedAt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* KPI Quick Stats */}
      {kpis && (
        <div className="hidden lg:flex items-center gap-4 px-4 border-l border-border text-xs">
          <div>
            <p className="text-muted-foreground">Revenue</p>
            <p className="font-semibold text-foreground">${kpis.totalRevenue >= 1000 ? (kpis.totalRevenue/1000).toFixed(0)+"K" : kpis.totalRevenue.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Orders</p>
            <p className="font-semibold text-foreground">{formatNumber(kpis.totalOrders)}</p>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="relative">
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
          <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse-slow" />
        </button>
      </div>

      {/* User Avatar */}
      <div className="flex items-center gap-2 cursor-pointer group">
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user.name || "User Avatar"}
            className="w-8 h-8 rounded-full object-cover border border-border"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-5 flex items-center justify-center text-white text-xs font-bold">
             {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="hidden md:block text-xs">
          <p className="font-semibold text-foreground">{user?.name || "Admin"}</p>
          <p className="text-muted-foreground capitalize">{user?.role || "admin"}</p>
        </div>
      </div>
    </header>
  );
}
