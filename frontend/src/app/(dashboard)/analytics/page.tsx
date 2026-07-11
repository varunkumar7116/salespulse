"use client";
// app/(dashboard)/analytics/page.tsx

import React, { useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
  BarChart3, ArrowRight, Activity, Percent, ArrowUpRight
} from "lucide-react";
import { useDatasetStore } from "@/store/dataset-store";
import { formatCurrency, formatNumber } from "@/lib/data-processor";
import dynamic from "next/dynamic";
const EChartsWrapper = dynamic(() => import("@/components/charts/echarts-wrapper"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted/25 rounded-xl h-[280px] w-full" />
});
import { buildAreaChart, buildPieChart, buildRadarChart, buildGaugeChart, CHART_COLORS } from "@/lib/chart-utils";

export default function AnalyticsDashboard() {
  const { kpis, sales, products, activeDatasetId } = useDatasetStore();
  const hasData = !!kpis && !!activeDatasetId;

  // Monthly Revenue & Profit Chart
  const revenueChartOption = useMemo(() => {
    if (!sales) return null;
    const data = sales.monthly.slice(-12);
    return buildAreaChart(
      data.map(d => { const [y, m] = d.month.split("-"); return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m)-1]} ${y}`; }),
      [
        { name: "Revenue", data: data.map(d => d.revenue), color: CHART_COLORS[0] },
        { name: "Profit", data: data.map(d => d.profit), color: CHART_COLORS[1] }
      ]
    );
  }, [sales]);

  // Regional breakdown
  const regionalRadarOption = useMemo(() => {
    if (!sales) return null;
    const maxVal = Math.max(...sales.byRegion.map(r => r.revenue)) * 1.1 || 10000;
    const indicators = sales.byRegion.map(r => ({ name: r.region, max: maxVal }));
    const data = sales.byRegion.map(r => r.revenue);
    
    return buildRadarChart(
      indicators,
      [{ name: "Revenue by Region", data, color: CHART_COLORS[4] }]
    );
  }, [sales]);

  // Channel/Payment preferences donut chart
  const paymentPrefsOption = useMemo(() => {
    if (!sales) return null;
    const pm = sales.byPaymentMethod;
    return buildPieChart(
      pm.map(p => ({ name: p.method, value: p.revenue })),
      { donut: true, legend: false }
    );
  }, [sales]);

  // Gauge chart for target conversion or margin
  const marginGaugeOption = useMemo(() => {
    if (!kpis) return null;
    return buildGaugeChart(kpis.profitMargin, 100, "% Margin", CHART_COLORS[1]);
  }, [kpis]);

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
        <BarChart3 className="w-12 h-12 text-muted-foreground/40 animate-pulse" />
        <h2 className="text-xl font-bold text-foreground">No Analytics Profile Loaded</h2>
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
          <h1 className="page-title">Executive KPIs Overview</h1>
          <p className="page-subtitle">Summary of company metrics and performance dimensions</p>
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold">
            <span>TOTAL REVENUE</span>
            <span className={kpis.revenueGrowth >= 0 ? "text-success" : "text-destructive"}>
              {kpis.revenueGrowth >= 0 ? "+" : ""}{kpis.revenueGrowth}%
            </span>
          </div>
          <p className="text-3xl font-black text-foreground tracking-tight">{formatCurrency(kpis.totalRevenue)}</p>
          <div className="progress-bar">
            <div className="progress-fill bg-primary" style={{ width: "70%" }} />
          </div>
        </div>

        <div className="card space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold">
            <span>GROSS PROFIT</span>
            <span className={kpis.profitGrowth >= 0 ? "text-success" : "text-destructive"}>
              {kpis.profitGrowth >= 0 ? "+" : ""}{kpis.profitGrowth}%
            </span>
          </div>
          <p className="text-3xl font-black text-foreground tracking-tight">{formatCurrency(kpis.totalProfit)}</p>
          <div className="progress-bar">
            <div className="progress-fill bg-success" style={{ width: "65%" }} />
          </div>
        </div>

        <div className="card space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold">
            <span>OPERATING MARGIN</span>
            <span className="text-success">+1.8%</span>
          </div>
          <p className="text-3xl font-black text-foreground tracking-tight">{kpis.profitMargin}%</p>
          <div className="progress-bar">
            <div className="progress-fill bg-chart-5" style={{ width: `${kpis.profitMargin}%` }} />
          </div>
        </div>

        <div className="card space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold">
            <span>LOSS RATIO</span>
            <span className={kpis.lossPercentage > 5 ? "text-destructive" : "text-success"}>
              {kpis.lossPercentage.toFixed(1)}%
            </span>
          </div>
          <p className="text-3xl font-black text-foreground tracking-tight">
            {kpis.lossPercentage.toFixed(1)}%
          </p>
          <div className="progress-bar">
            <div className="progress-fill bg-destructive" style={{ width: `${kpis.lossPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* Main Revenue Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Revenue and Profit Development</h3>
              <p className="text-xs text-muted-foreground">Timeline development over the last 12 periods</p>
            </div>
            <Link href="/dashboard/analytics/sales" className="btn-secondary text-xs py-1.5 px-2.5">
              Sales Drill-down <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {revenueChartOption && <EChartsWrapper option={revenueChartOption} height={280} />}
        </div>

        {/* Profit Margin Gauge */}
        <div className="card flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Operational Margin Target</h3>
            <p className="text-xs text-muted-foreground">Profit margin benchmark index</p>
          </div>
          <div className="py-6 flex items-center justify-center">
            {marginGaugeOption && <EChartsWrapper option={marginGaugeOption} height={180} />}
          </div>
          <div className="text-center text-xs text-muted-foreground border-t border-border/40 pt-4">
            Target benchmark is <strong>15%</strong>. You are currently operating at a {kpis.profitMargin > 15 ? "healthy surplus" : "leaner margin"}.
          </div>
        </div>
      </div>

      {/* Regional Radar and Category preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Radar */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Geographic Revenue Concentration</h3>
            <p className="text-xs text-muted-foreground">Distribution across customer regional hubs</p>
          </div>
          {regionalRadarOption && <EChartsWrapper option={regionalRadarOption} height={280} />}
        </div>

        {/* Channels/Payment options */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Payment Method Breakdown</h3>
            <p className="text-xs text-muted-foreground">Distribution by transaction values</p>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            {paymentPrefsOption && <EChartsWrapper option={paymentPrefsOption} height={240} />}
            <div className="space-y-3">
              {sales?.byPaymentMethod.slice(0, 4).map((pref, i) => (
                <div key={pref.method} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      {pref.method}
                    </span>
                    <span className="font-bold text-foreground font-mono">{formatCurrency(pref.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
