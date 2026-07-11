"use client";
// app/(dashboard)/inventory/page.tsx

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Package, AlertTriangle, RefreshCw, BarChart3,
  ArrowRight, ShieldCheck, CheckCircle2, Factory, Trash2
} from "lucide-react";
import { useDatasetStore } from "@/store/dataset-store";
import { formatCurrency, formatNumber } from "@/lib/data-processor";
import dynamic from "next/dynamic";
const EChartsWrapper = dynamic(() => import("@/components/charts/echarts-wrapper"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted/25 rounded-xl h-[260px] w-full" />
});
import { buildBarChart, CHART_COLORS } from "@/lib/chart-utils";

export default function InventoryPage() {
  const { kpis, inventory, activeDatasetId } = useDatasetStore();
  const hasData = !!kpis && !!activeDatasetId && !!inventory;

  // Turnover rate bar chart
  const turnoverChartOption = useMemo(() => {
    if (!inventory) return null;
    const rates = inventory.turnover.slice(0, 15);
    return buildBarChart(
      rates.map(r => r.name.slice(0, 12) + "…"),
      [{ name: "Turnover Ratio", data: rates.map(r => r.turnover), color: CHART_COLORS[4] }]
    );
  }, [inventory]);

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Package className="w-12 h-12 text-muted-foreground/40 animate-pulse" />
        <h2 className="text-xl font-bold text-foreground">No Inventory Profiles Loaded</h2>
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
          <h1 className="page-title">Inventory Analytics</h1>
          <p className="page-subtitle">Stock levels, reorder level predictions, overstock alerts, and turnover indexes</p>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Stock Available</p>
          <p className="text-3xl font-black text-foreground font-mono">{formatNumber(inventory.totalStock)}</p>
          <div className="text-xs text-muted-foreground font-medium">Items currently in storage</div>
        </div>

        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Out of Stock</p>
          <p className={`text-3xl font-black font-mono ${inventory.outOfStock > 0 ? "text-destructive" : "text-success"}`}>
            {inventory.outOfStock}
          </p>
          <div className="text-xs text-muted-foreground font-medium">SKUs with zero inventory</div>
        </div>

        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Stock Health Score</p>
          <p className="text-3xl font-black text-foreground font-mono">{inventory.stockHealthScore}%</p>
          <div className="progress-bar">
            <div className="progress-fill bg-primary" style={{ width: `${inventory.stockHealthScore}%` }} />
          </div>
        </div>

        <div className="card space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Low Stock Alerts</p>
          <p className={`text-3xl font-black font-mono ${inventory.lowStock.length > 0 ? "text-warning" : "text-success"}`}>
            {inventory.lowStock.length}
          </p>
          <div className="text-xs text-muted-foreground font-medium">SKUs below safety buffers</div>
        </div>
      </div>

      {/* Charts & warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Warning table */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Reorder Level Warnings</h3>
            <p className="text-xs text-muted-foreground">Critical products requiring prompt replenishment</p>
          </div>
          <div className="overflow-y-auto max-h-64 border border-border rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Product</th>
                  <th className="table-header">Stock</th>
                  <th className="table-header">Reorder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {inventory.lowStock.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="table-cell text-center text-muted-foreground py-6">
                      ✓ All inventory above safety level
                    </td>
                  </tr>
                ) : (
                  inventory.lowStock.map((item) => (
                    <tr key={item.name} className="hover:bg-muted/30">
                      <td className="table-cell font-medium text-foreground truncate max-w-[120px]">{item.name}</td>
                      <td className="table-cell text-warning font-bold font-mono">{item.stock}</td>
                      <td className="table-cell font-mono text-muted-foreground">{item.reorderLevel}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overstock Alert table */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Overstock Diagnostics</h3>
            <p className="text-xs text-muted-foreground">Excess stock tying up working capital (90+ Days)</p>
          </div>
          <div className="overflow-y-auto max-h-64 border border-border rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Product</th>
                  <th className="table-header">Stock</th>
                  <th className="table-header">Days Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {inventory.overstock.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="table-cell text-center text-muted-foreground py-6">
                      No overstocked inventory detected
                    </td>
                  </tr>
                ) : (
                  inventory.overstock.map((item) => (
                    <tr key={item.name} className="hover:bg-muted/30">
                      <td className="table-cell font-medium text-foreground truncate max-w-[120px]">{item.name}</td>
                      <td className="table-cell font-bold font-mono text-primary">{item.stock}</td>
                      <td className="table-cell font-mono text-muted-foreground">{item.daysOfStock} Days</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dead Stock Alert table */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Dead Stock Accumulations</h3>
            <p className="text-xs text-muted-foreground">Items with inventory but no recent transaction logs</p>
          </div>
          <div className="overflow-y-auto max-h-64 border border-border rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Product Name</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {inventory.deadStock.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="table-cell text-center text-muted-foreground py-6">
                      No dead stock detected
                    </td>
                  </tr>
                ) : (
                  inventory.deadStock.map((item) => (
                    <tr key={item.name} className="hover:bg-muted/30">
                      <td className="table-cell font-medium text-foreground truncate max-w-[120px]">{item.name}</td>
                      <td className="table-cell text-muted-foreground">{item.category}</td>
                      <td className="table-cell text-destructive font-bold font-mono">{item.stock}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Turnover Chart & Supplier directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Turnover chart */}
        <div className="lg:col-span-2 card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Product Inventory Turnover Rates</h3>
            <p className="text-xs text-muted-foreground">Inventory replenishment speeds per product</p>
          </div>
          {turnoverChartOption && <EChartsWrapper option={turnoverChartOption} height={260} />}
        </div>

        {/* Supplier Table */}
        <div className="card space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Supplier Directory</h3>
            <p className="text-xs text-muted-foreground">List of suppliers, stock values, and average turnovers</p>
          </div>
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Supplier</th>
                  <th className="table-header">Items</th>
                  <th className="table-header">Stock Val</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {inventory.bySupplier.map((sup) => (
                  <tr key={sup.supplier} className="hover:bg-muted/30">
                    <td className="table-cell font-semibold text-foreground">{sup.supplier}</td>
                    <td className="table-cell font-mono">{sup.products}</td>
                    <td className="table-cell font-mono font-semibold text-primary">{formatNumber(sup.totalStock)}</td>
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
