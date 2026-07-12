"use client";
// components/layout/sidebar.tsx

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3, Upload, ShoppingBag, Users, DollarSign, Package,
  TrendingUp, Brain, FileText, Settings, ChevronLeft, ChevronRight,
  Home, Bell, Map, PieChart, Activity, Zap, LogOut, Database
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  group?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home, group: "Overview" },
  { label: "Upload Data", href: "/dashboard/upload", icon: Upload, group: "Overview" },
  { label: "KPI Overview", href: "/dashboard/analytics", icon: BarChart3, group: "Analytics" },
  { label: "Sales Analytics", href: "/dashboard/analytics/sales", icon: Activity, group: "Analytics" },
  { label: "Product Analytics", href: "/dashboard/analytics/product", icon: ShoppingBag, group: "Analytics" },
  { label: "Customer Analytics", href: "/dashboard/analytics/customer", icon: Users, group: "Analytics" },
  { label: "Profit Analysis", href: "/dashboard/analytics/profit", icon: DollarSign, group: "Analytics" },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package, group: "Analytics" },
  { label: "Forecasting", href: "/dashboard/forecasting", icon: TrendingUp, group: "AI & ML" },
  { label: "AI Insights", href: "/dashboard/insights", icon: Brain, group: "AI & ML" },
  { label: "Reports", href: "/dashboard/reports", icon: FileText, group: "Tools" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, group: "Tools" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const groups = Array.from(new Set(NAV_ITEMS.map((n) => n.group)));

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out shrink-0 ${collapsed ? "w-[68px]" : "w-[260px]"}`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 glow-primary">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-fade-in">
              <p className="text-sm font-bold text-foreground truncate leading-tight">SalesPulse</p>
              <p className="text-[10px] text-muted-foreground truncate">Business Intelligence</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`ml-auto p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all ${collapsed ? "mx-auto" : ""}`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        {groups.map((group) => (
          <div key={group}>
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {group}
              </p>
            )}
            <div className="space-y-0.5">
              {NAV_ITEMS.filter((n) => n.group === group).map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    <item.icon className={`shrink-0 ${active ? "w-4 h-4" : "w-4 h-4"}`} />
                    {!collapsed && (
                      <span className="truncate animate-fade-in">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-2 shrink-0">
        <button
          onClick={logout}
          title={collapsed ? "Sign Out" : undefined}
          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
