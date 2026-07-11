"use client";
// app/(dashboard)/analytics/profit/page.tsx

import React, { useMemo } from "react";
import Link from "next/link";
import {
  DollarSign, TrendingUp, TrendingDown, Percent,
  ArrowRight, Activity, Layers, AlertCircle
} from "lucide-react";
import { useDatasetStore } from "@/store/dataset-store";
import { formatCurrency, formatNumber } from "@/lib/data-processor";
import dynamic from "next/dynamic";
const EChartsWrapper = dynamic(() => import("@/components/charts/echarts-wrapper"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted/25 rounded-xl h-[280px] w-full" />
});
import { buildWaterfallChart, buildBarChart, CHART_COLORS } from "@/lib/chart-utils";

export default function ProfitAnalyticsPage() {
  const { kpis, profit, activeDatasetId } = useDatasetStore();
  const hasData = !!kpis && !!activeDatasetId && !!profit;

  // Waterfall Chart: Revenue -> COGS -> Gross Profit -> Operating Exp -> Net Profit
  const waterfallChartOption = useMemo(() => {
    if (!profit) return null;
    return buildWaterfallChart(profit.waterfall);
  }, [profit]);

  // Category Profit Margins
  const categoryProfitOption = useMemo(() => {
    if (!profit) return null;
    return buildBarChart(
      profit.byCategory.map(c => c.category),
      [{ name: "Profit Margin %", data: profit.byCategory.map(c => parseFloat(c.margin.toFixed(1))), color: CHART_COLORS[1] }]
    );
  }, [profit]);

  // Regional profit margins
  const regionalProfitOption = useMemo(() => {
    if (!profit) return null;
    return buildBarChart(
      profit.byRegion.map(r => r.region),
      [{ name: "Profit Margin %", data: profit.byRegion.map(r => parseFloat(r.margin.toFixed(1))), color: CHART_COLORS[2] }]
    );
  }, [profit]);

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
        <DollarSign className="w-12 h-12 text-muted-foreground/40 animate-pulse" />
        <h2 className="text-xl font-bold text-foreground">No Profit Analytics Profiles Loaded</h2>
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
          <h1 className="page-title">Profit Analysis & Waterfall</h1>
          <p className="page-subtitle">Gross/Net margins, profit leakages, loss-making orders, and cost waterfalls</p>
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Gross Profit</p>
          <p className="text-3xl font-black text-foreground font-mono">{formatCurrency(profit.grossProfit)}</p>
          <div className="text-xs text-success font-semibold">✓ Before operating deductions</div>
        </div>

        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Net Profit</p>
          <p className="text-3xl font-black text-foreground font-mono">{formatCurrency(profit.netProfit)}</p>
          <div className="text-xs text-muted-foreground">Operating deductions applied (15%)</div>
        </div>

        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Profit Margin</p>
          <p className="text-3xl font-black text-foreground font-mono">{profit.profitMargin}%</p>
          <div className="progress-bar">
            <div className="progress-fill bg-primary" style={{ width: `${profit.profitMargin}%` }} />
          </div>
        </div>

        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Loss Orders</p>
          <p className="text-3xl font-black text-destructive font-mono">{formatNumber(profit.lossOrders)}</p>
          <div className="text-xs text-destructive font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Profit leakage points
          </div>
        </div>
      </div>

      {/* Waterfall row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Revenue Cost-to-Profit Waterfall</h3>
            <p className="text-xs text-muted-foreground">Drill-down breakdown showing steps from gross revenue down to net profitability</p>
          </div>
          {waterfallChartOption && <EChartsWrapper option={waterfallChartOption} height={280} />}
        </div>

        {/* Leakage products list */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Top Profit Leakage Products</h3>
            <p className="text-xs text-muted-foreground">Unprofitable items requiring immediate action</p>
          </div>
          <div className="overflow-y-auto max-h-60 border border-border rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Product</th>
                  <th className="table-header">Margin</th>
                  <th className="table-header">Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {profit.lowProfitProducts.slice(0, 5).map((p) => (
                  <tr key={p.name} className="hover:bg-muted/30">
                    <td className="table-cell font-medium text-foreground truncate max-w-[140px]">{p.name}</td>
                    <td className="table-cell font-mono text-destructive font-semibold">{p.margin.toFixed(1)}%</td>
                    <td className="table-cell text-destructive font-bold font-mono">{formatCurrency(Math.abs(p.profit))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category and Region margins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category margins */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Category Profit Margins</h3>
            <p className="text-xs text-muted-foreground">Net margins calculated per product category</p>
          </div>
          {categoryProfitOption && <EChartsWrapper option={categoryProfitOption} height={260} />}
        </div>

        {/* Region margins */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Regional Profit Margins</h3>
            <p className="text-xs text-muted-foreground">Net margins calculated across sales regions</p>
          </div>
          {regionalProfitOption && <EChartsWrapper option={regionalProfitOption} height={260} />}
        </div>
      </div>
    </div>
  );
}
