"use client";
// app/(dashboard)/analytics/product/page.tsx

import React, { useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp, ShoppingBag, DollarSign, Package,
  BarChart3, Activity, Layers, ListOrdered
} from "lucide-react";
import { useDatasetStore } from "@/store/dataset-store";
import { formatCurrency, formatNumber } from "@/lib/data-processor";
import dynamic from "next/dynamic";
const EChartsWrapper = dynamic(() => import("@/components/charts/echarts-wrapper"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted/25 rounded-xl h-[280px] w-full" />
});
import { buildTreemapChart, buildBarChart, CHART_COLORS } from "@/lib/chart-utils";

export default function ProductAnalyticsPage() {
  const { kpis, products, activeDatasetId } = useDatasetStore();
  const hasData = !!kpis && !!activeDatasetId && !!products;

  // Category treemap
  const categoryTreemapOption = useMemo(() => {
    if (!products) return null;
    return buildTreemapChart(
      products.byCategory.map(c => ({
        name: c.category,
        value: c.revenue
      }))
    );
  }, [products]);

  // ABC Analysis chart (Pareto cumulative chart)
  const abcChartOption = useMemo(() => {
    if (!products) return null;
    const abc = products.abcAnalysis.slice(0, 15);
    return {
      tooltip: { trigger: "axis" as const },
      xAxis: { type: "category" as const, data: abc.map(a => a.name.slice(0, 12) + "…") },
      yAxis: [
        { type: "value" as const, name: "Revenue", axisLabel: { formatter: (v: number) => `$${(v/1000).toFixed(0)}k` } },
        { type: "value" as const, name: "Cumulative %", max: 100, min: 0 }
      ],
      series: [
        { name: "Revenue", type: "bar" as const, data: abc.map(a => a.revenue), itemStyle: { color: CHART_COLORS[0] } },
        { name: "Cumulative Pct", type: "line" as const, yAxisIndex: 1, data: abc.map(a => a.cumPct), lineStyle: { color: CHART_COLORS[5], width: 2 } }
      ]
    };
  }, [products]);

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-muted-foreground/40 animate-pulse" />
        <h2 className="text-xl font-bold text-foreground">No Product Analytics Profiles Loaded</h2>
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
          <h1 className="page-title">Product Analytics & Portfolio</h1>
          <p className="page-subtitle">Product velocity, category volumes, and catalog ABC classification</p>
        </div>
      </div>

      {/* Categories and ABC Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Contribution Treemap */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Category Volume Distribution</h3>
            <p className="text-xs text-muted-foreground">Interactive treemap breakdown of revenue by categories</p>
          </div>
          {categoryTreemapOption && <EChartsWrapper option={categoryTreemapOption} height={280} />}
        </div>

        {/* ABC Analysis Chart */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">ABC Analysis (Pareto Classification)</h3>
            <p className="text-xs text-muted-foreground">Identifying top products that drive 80% of total revenue</p>
          </div>
          {abcChartOption && <EChartsWrapper option={abcChartOption} height={280} />}
        </div>
      </div>

      {/* Catalog lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Top 10 Performers</h3>
            <p className="text-xs text-muted-foreground">Top performing SKUs ranked by revenue contribution</p>
          </div>
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Product</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Qty Sold</th>
                  <th className="table-header">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {products.topProducts.map((p, idx) => (
                  <tr key={p.name} className="hover:bg-muted/30">
                    <td className="table-cell font-semibold text-foreground truncate max-w-[200px]">
                      {idx + 1}. {p.name}
                    </td>
                    <td className="table-cell">{p.category}</td>
                    <td className="table-cell font-mono">{formatNumber(p.quantity)}</td>
                    <td className="table-cell text-primary font-bold font-mono">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ABC Classification Table */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">ABC Catalog Classification</h3>
            <p className="text-xs text-muted-foreground">Pareto classification index values</p>
          </div>
          <div className="overflow-y-auto max-h-80 border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Product Name</th>
                  <th className="table-header">Revenue</th>
                  <th className="table-header">Cumulative %</th>
                  <th className="table-header">Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {products.abcAnalysis.slice(0, 30).map((p) => (
                  <tr key={p.name} className="hover:bg-muted/30">
                    <td className="table-cell font-medium text-foreground truncate max-w-[200px]">{p.name}</td>
                    <td className="table-cell font-mono">{formatCurrency(p.revenue)}</td>
                    <td className="table-cell font-mono">{p.cumPct.toFixed(1)}%</td>
                    <td className="table-cell">
                      <span className={`badge ${
                        p.class === "A" ? "badge-success" : p.class === "B" ? "badge-primary" : "badge-muted"
                      }`}>
                        Class {p.class}
                      </span>
                    </td>
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
