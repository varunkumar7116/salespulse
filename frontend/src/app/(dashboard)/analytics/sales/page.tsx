"use client";
// app/(dashboard)/analytics/sales/page.tsx

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
  BarChart3, Activity, ArrowLeft, Percent, Layers
} from "lucide-react";
import { useDatasetStore } from "@/store/dataset-store";
import { formatCurrency, formatNumber } from "@/lib/data-processor";
import dynamic from "next/dynamic";
const EChartsWrapper = dynamic(() => import("@/components/charts/echarts-wrapper"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted/25 rounded-xl h-[320px] w-full" />
});
import { buildLineChart, buildBarChart, CHART_COLORS } from "@/lib/chart-utils";

export default function SalesAnalyticsPage() {
  const { kpis, sales, activeDatasetId } = useDatasetStore();
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");

  const hasData = !!kpis && !!activeDatasetId && !!sales;

  // Revenue & Orders Timeline
  const salesTimelineOption = useMemo(() => {
    if (!sales) return null;
    const data = timeframe === "daily" ? sales.daily : (timeframe === "weekly" ? sales.weekly : sales.monthly);
    
    return buildLineChart(
      data.map((d: any) => {
        if (timeframe === "monthly") {
          const [y, m] = d.month.split("-");
          return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m)-1]} ${y}`;
        }
        return d.date || d.week || "";
      }),
      [
        { name: "Revenue", data: data.map((d: any) => d.revenue), color: CHART_COLORS[0] },
        { name: "Orders", data: data.map((d: any) => d.orders), color: CHART_COLORS[2] }
      ],
      { smooth: true, area: true }
    );
  }, [sales, timeframe]);

  // Discount Impact option
  const discountImpactOption = useMemo(() => {
    if (!sales) return null;
    const di = sales.discountImpact;
    return buildBarChart(
      di.map(d => d.range),
      [{ name: "Average Order Value", data: di.map(d => d.avgRevenue), color: CHART_COLORS[3] }]
    );
  }, [sales]);

  // Moving Average option (last 30 periods)
  const movingAverageOption = useMemo(() => {
    if (!sales) return null;
    const ma = sales.movingAverage;
    return buildLineChart(
      ma.map(d => d.date),
      [
        { name: "7-Day MA", data: ma.map(d => d.ma7), color: CHART_COLORS[4] },
        { name: "30-Day MA", data: ma.map(d => d.ma30), color: CHART_COLORS[1] }
      ]
    );
  }, [sales]);

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Activity className="w-12 h-12 text-muted-foreground/40 animate-pulse" />
        <h2 className="text-xl font-bold text-foreground">No Sales Analytics Profiles Loaded</h2>
        <p className="text-muted-foreground max-w-sm">Please upload your dataset sheet in the Dataset Manager first.</p>
        <Link href="/dashboard/upload" className="btn-primary">
          Go to Manager
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="page-title">Sales Trends & Channels</h1>
          <p className="page-subtitle">Timeline velocity, channels, and performance ranking breakdown</p>
        </div>
      </div>

      {/* Timeframe Selector and Chart */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-semibold text-foreground">Revenue Growth Timeline</h3>
            <p className="text-xs text-muted-foreground">Detailed chart of revenue velocity over chosen interval</p>
          </div>
          <div className="flex bg-muted/60 p-0.5 rounded-lg border border-border">
            {(["daily", "weekly", "monthly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${
                  timeframe === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {salesTimelineOption && <EChartsWrapper option={salesTimelineOption} height={320} />}
      </div>

      {/* Lower Row - Discount and MA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discount Impact */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Discount Impact Matrix</h3>
            <p className="text-xs text-muted-foreground">Impact of discount rates on Average Order Values</p>
          </div>
          {discountImpactOption && <EChartsWrapper option={discountImpactOption} height={260} />}
        </div>

        {/* Moving Average */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Moving Averages (Trends)</h3>
            <p className="text-xs text-muted-foreground">Smooth line trend signals using 7-day & 30-day offsets</p>
          </div>
          {movingAverageOption && <EChartsWrapper option={movingAverageOption} height={260} />}
        </div>
      </div>

      {/* Drill-down Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salespeople Ranking */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Salesperson Deal Volume</h3>
            <p className="text-xs text-muted-foreground">Individual deal volume metrics and averages</p>
          </div>
          <div className="overflow-y-auto max-h-80 border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Representative</th>
                  <th className="table-header">Revenue</th>
                  <th className="table-header">Orders</th>
                  <th className="table-header">Avg Deal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {sales.bySalesperson.map((rep) => (
                  <tr key={rep.salesperson} className="hover:bg-muted/30">
                    <td className="table-cell font-semibold text-foreground">{rep.salesperson}</td>
                    <td className="table-cell text-primary font-bold font-mono">{formatCurrency(rep.revenue)}</td>
                    <td className="table-cell font-mono">{rep.orders}</td>
                    <td className="table-cell text-muted-foreground font-mono">{formatCurrency(rep.avgDeal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic Hubs */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Regional Densities (City Level)</h3>
            <p className="text-xs text-muted-foreground">Geographic density distribution ranking by city sales</p>
          </div>
          <div className="overflow-y-auto max-h-80 border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">City Location</th>
                  <th className="table-header">Revenue</th>
                  <th className="table-header">Deals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {sales.byCity.map((city) => (
                  <tr key={city.city} className="hover:bg-muted/30">
                    <td className="table-cell font-semibold text-foreground">{city.city}</td>
                    <td className="table-cell text-primary font-bold font-mono">{formatCurrency(city.revenue)}</td>
                    <td className="table-cell font-mono">{city.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
