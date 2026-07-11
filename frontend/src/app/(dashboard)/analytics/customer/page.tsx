"use client";
// app/(dashboard)/analytics/customer/page.tsx

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Users, TrendingUp, DollarSign, Award,
  ArrowRight, Activity, Smile, Trash2
} from "lucide-react";
import { useDatasetStore } from "@/store/dataset-store";
import { formatCurrency, formatNumber } from "@/lib/data-processor";
import dynamic from "next/dynamic";
const EChartsWrapper = dynamic(() => import("@/components/charts/echarts-wrapper"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted/25 rounded-xl h-[280px] w-full" />
});
import { buildScatterChart, buildBarChart, buildPieChart, CHART_COLORS } from "@/lib/chart-utils";

export default function CustomerAnalyticsPage() {
  const { kpis, customers, activeDatasetId } = useDatasetStore();
  const hasData = !!kpis && !!activeDatasetId && !!customers;

  // RFM Analysis Scatter Plot
  const rfmScatterOption = useMemo(() => {
    if (!customers) return null;
    return buildScatterChart(
      customers.rfm.map(c => ({
        name: c.customer,
        x: c.recency,
        y: c.frequency,
        size: c.monetary,
        category: c.segment
      })),
      { xLabel: "Recency Score", yLabel: "Frequency Score" }
    );
  }, [customers]);

  // Demographics: Age distribution
  const ageChartOption = useMemo(() => {
    if (!customers) return null;
    return buildBarChart(
      customers.byAge.map(a => a.range),
      [{ name: "Customers count", data: customers.byAge.map(a => a.count), color: CHART_COLORS[1] }]
    );
  }, [customers]);

  // Demographics: Gender share
  const genderPieOption = useMemo(() => {
    if (!customers) return null;
    return buildPieChart(
      customers.byGender.map(g => ({ name: g.gender, value: g.count })),
      { donut: true }
    );
  }, [customers]);

  // Purchase frequency distribution
  const freqOption = useMemo(() => {
    if (!customers) return null;
    return buildBarChart(
      customers.purchaseFrequency.map(f => f.range),
      [{ name: "Customers count", data: customers.purchaseFrequency.map(f => f.customers), color: CHART_COLORS[5] }]
    );
  }, [customers]);

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Users className="w-12 h-12 text-muted-foreground/40 animate-pulse" />
        <h2 className="text-xl font-bold text-foreground">No Customer Analytics Profiles Loaded</h2>
        <p className="text-muted-foreground max-w-sm">Please upload your dataset sheet in the Dataset Manager first.</p>
        <Link href="/dashboard/upload" className="btn-primary">
          Go to Manager
        </Link>
      </div>
    );
  }

  const retentionRate = 100 - customers.churnRate;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="page-title">Customer Analytics & Churn</h1>
          <p className="page-subtitle">Demographics, RFM scores, repeat purchase behaviors and retention indexes</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Active Customers</p>
          <p className="text-3xl font-black text-foreground font-mono">{formatNumber(customers.total)}</p>
          <div className="text-xs text-muted-foreground">
            New: <span className="font-semibold text-foreground">{formatNumber(customers.newCustomers)}</span> • Returning: <span className="font-semibold text-foreground">{formatNumber(customers.returning)}</span>
          </div>
        </div>

        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Average Lifetime Value</p>
          <p className="text-3xl font-black text-foreground font-mono">{formatCurrency(customers.avgLifetimeValue)}</p>
          <div className="text-xs text-success font-semibold">✓ High-value cohort potential</div>
        </div>

        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Retention Rate</p>
          <p className="text-3xl font-black text-foreground font-mono">{retentionRate.toFixed(1)}%</p>
          <div className="progress-bar">
            <div className="progress-fill bg-success" style={{ width: `${retentionRate}%` }} />
          </div>
        </div>

        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Churn Risk Index</p>
          <p className="text-3xl font-black text-foreground font-mono">{customers.churnRate.toFixed(1)}%</p>
          <div className="progress-bar">
            <div className="progress-fill bg-destructive" style={{ width: `${customers.churnRate}%` }} />
          </div>
        </div>
      </div>

      {/* RFM Segmentation and frequency distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RFM Scatter */}
        <div className="lg:col-span-2 card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">RFM Analysis (Recency vs Frequency)</h3>
            <p className="text-xs text-muted-foreground">Visualizes monetary value (bubble size), frequency, and recency of customers</p>
          </div>
          {rfmScatterOption && <EChartsWrapper option={rfmScatterOption} height={280} />}
        </div>

        {/* Purchase Frequency */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Purchase Frequency</h3>
            <p className="text-xs text-muted-foreground">Distribution of order counts per customer</p>
          </div>
          {freqOption && <EChartsWrapper option={freqOption} height={285} />}
        </div>
      </div>

      {/* Demographics row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age chart */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Age Cohort Distribution</h3>
            <p className="text-xs text-muted-foreground">Customer counts sorted across age ranges</p>
          </div>
          {ageChartOption && <EChartsWrapper option={ageChartOption} height={260} />}
        </div>

        {/* Gender pie chart */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Customer Gender Share</h3>
            <p className="text-xs text-muted-foreground">Share of customer cohorts by gender declarations</p>
          </div>
          {genderPieOption && <EChartsWrapper option={genderPieOption} height={260} />}
        </div>
      </div>

      {/* Customer Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Customers */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Top 10 Customers by Revenue</h3>
            <p className="text-xs text-muted-foreground">Highest-paying accounts in dataset</p>
          </div>
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Client Name</th>
                  <th className="table-header">Client ID</th>
                  <th className="table-header">Total Spend</th>
                  <th className="table-header">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {customers.top10.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="table-cell font-semibold text-foreground">{c.name}</td>
                    <td className="table-cell font-mono text-xs text-muted-foreground">{c.id}</td>
                    <td className="table-cell text-primary font-bold font-mono">{formatCurrency(c.revenue)}</td>
                    <td className="table-cell font-mono">{c.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inactive Accounts */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Inactive / Churn Risk Warnings</h3>
            <p className="text-xs text-muted-foreground">Customers who haven't ordered in 90+ days</p>
          </div>
          <div className="overflow-y-auto max-h-80 border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Client Name</th>
                  <th className="table-header">Client ID</th>
                  <th className="table-header">Days Inactive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {customers.inactive.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30">
                    <td className="table-cell font-semibold text-foreground">{c.name}</td>
                    <td className="table-cell font-mono text-xs text-muted-foreground">{c.id}</td>
                    <td className="table-cell text-destructive font-bold font-mono">{c.daysSinceLastOrder} Days</td>
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
