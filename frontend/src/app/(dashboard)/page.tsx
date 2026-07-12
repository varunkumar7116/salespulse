"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Zap, Upload, BarChart3, TrendingUp, Brain, FileText,
  Settings, Play, Shield, Sparkles, Check, Database,
  ArrowRight, Landmark, ArrowUpRight, ShoppingBag, DollarSign, Users
} from "lucide-react";
import { useDatasetStore } from "@/store/dataset-store";
import { cleanData, formatCurrency, formatNumber } from "@/lib/data-processor";
import { toast } from "sonner";

export default function DashboardHome() {
  const { datasets, activeDatasetId, kpis, addDataset, setActiveDataset } = useDatasetStore();
  const activeDataset = datasets.find(d => d.id === activeDatasetId);
  const hasData = !!kpis && !!activeDatasetId;

  const loadSampleDataset = async () => {
    try {
      const res = await fetch("/data/sample_sales.json");
      if (!res.ok) throw new Error("Could not fetch sample dataset");
      const rawRows = await res.json();
      
      const { rows, report, profile } = cleanData(rawRows);
      
      const datasetId = "ds_sample";
      addDataset({
        id: datasetId,
        name: "Sample Enterprise Sales",
        originalName: "sample_sales.json",
        uploadedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        rows: rows.length,
        columns: report.columnsFound.length + report.columnsMissing.length,
        sizeBytes: 52000,
        status: "ready"
      }, rows, report, profile);
      
      toast.success("Loaded sample enterprise sales dataset!");
    } catch (e: any) {
      toast.error(e.message || "Failed to load sample dataset");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-background to-chart-5/5 p-6 rounded-2xl border border-border">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            Welcome to SalesPulse <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze, predict, and optimize your business performance with automated BI pipelines.
          </p>
        </div>
        {!hasData && (
          <button
            onClick={loadSampleDataset}
            className="btn-primary py-2.5 px-5 text-sm gap-2 shrink-0 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 text-white fill-white" />
            Quick Demo: Load Sample Data
          </button>
        )}
      </div>

      {!hasData ? (
        // Empty State Dashboard
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card space-y-6 py-8">
            <div className="text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary glow-primary">
                <Database className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-foreground">Get Started with Your Data</h2>
                <p className="text-sm text-muted-foreground">
                  Upload your transaction records or try our premium mock sales dataset to experience all analysis models instantly.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <Link href="/dashboard/upload" className="btn-primary py-2 px-4 text-xs font-semibold gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  Upload CSV/Excel
                </Link>
                <button onClick={loadSampleDataset} className="btn-secondary py-2 px-4 text-xs font-semibold gap-1.5 border border-border">
                  <Play className="w-3.5 h-3.5 text-primary" />
                  Load Sample Data
                </button>
              </div>
            </div>
            
            <div className="border-t border-border/50 pt-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Supported Analytical Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: BarChart3, title: "Executive KPIs", desc: "Automated aggregation of revenue, profit, margins, and sales metrics.", color: "text-primary", bg: "bg-primary/5" },
                  { icon: TrendingUp, title: "ML Forecasting", desc: "Linear regression sales models predicting future revenue with confidence bands.", color: "text-success", bg: "bg-success/5" },
                  { icon: Brain, title: "AI Business Insights", desc: "Intelligent SWOT diagnostics profiling trends, risks, and recommendations.", color: "text-chart-4", bg: "bg-chart-4/5" },
                  { icon: FileText, title: "Report Generator", desc: "Download executive summaries and detailed sheets in PDF or Excel.", color: "text-chart-5", bg: "bg-chart-5/5" }
                ].map((feat) => (
                  <div key={feat.title} className="flex gap-3 p-3 rounded-xl border border-border/40 bg-card/50 hover:bg-card transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${feat.bg} flex items-center justify-center shrink-0`}>
                      <feat.icon className={`w-4 h-4 ${feat.color}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{feat.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card space-y-4">
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" /> Privacy & Security
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                SalesPulse processes all file transactions directly in your browser. None of your corporate financial or customer data is transmitted to our servers.
              </p>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-success/5 border border-success/20 text-success text-[11px] font-semibold">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>100% Client-Side ETL Pipeline</span>
              </div>
            </div>

            <div className="card space-y-4">
              <h3 className="font-semibold text-foreground text-sm">System Requirements</h3>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>CSV, XLS, or XLSX spreadsheets</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Up to 100MB file size limit</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Requires modern browser with JS enabled</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // Active Dashboard State
        <div className="space-y-6">
          {/* Active Dataset Stats Card */}
          <div className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-primary">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge bg-primary/10 text-primary text-xs font-bold font-mono">ACTIVE PROFILE</span>
                <h3 className="font-bold text-foreground text-base">{activeDataset?.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Parsed <strong>{formatNumber(activeDataset?.rows || 0)}</strong> rows with quality score of <strong>{activeDataset?.report?.qualityScore}%</strong>.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/upload" className="btn-secondary text-xs py-1.5 px-3 border border-border">
                Manage Datasets
              </Link>
              <Link href="/dashboard/analytics" className="btn-primary text-xs py-1.5 px-3 gap-1">
                View KPIs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Core Analytics Quick View */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "TOTAL REVENUE", value: formatCurrency(kpis.totalRevenue), icon: DollarSign, color: "text-primary", bg: "bg-primary/10", href: "/dashboard/analytics" },
              { label: "NET PROFIT", value: formatCurrency(kpis.totalProfit), icon: ShoppingBag, color: "text-success", bg: "bg-success/10", href: "/dashboard/analytics/profit" },
              { label: "PROFIT MARGIN", value: `${kpis.profitMargin}%`, icon: Landmark, color: "text-chart-5", bg: "bg-chart-5/10", href: "/dashboard/analytics" },
              { label: "TOTAL CUSTOMERS", value: formatNumber(kpis.totalCustomers), icon: Users, color: "text-warning", bg: "bg-warning/10", href: "/dashboard/analytics/customer" }
            ].map((stat) => (
              <Link key={stat.label} href={stat.href} className="card-hover p-5 space-y-3 cursor-pointer group block">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{stat.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-105 transition-transform`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Module Grid Shortcuts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card space-y-4">
              <h3 className="font-bold text-foreground text-sm">Dashboard Analysis Suites</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Sales & Trends", desc: "Detailed geographic, salesperson, and volume trends over time.", icon: BarChart3, href: "/dashboard/analytics/sales" },
                  { label: "Product & Inventory", desc: "ABC inventory analysis, dead stock profiling, and suppliers.", icon: ShoppingBag, href: "/dashboard/analytics/product" },
                  { label: "ML Sales Forecasting", desc: "Predict future revenue run-rates with 90% confidence bands.", icon: TrendingUp, href: "/dashboard/forecasting" },
                  { label: "AI Diagnostic Insights", desc: "Automated business report generation, SWOT, and mitigations.", icon: Brain, href: "/dashboard/insights" }
                ].map((suite) => (
                  <Link key={suite.label} href={suite.href} className="flex gap-4 p-4 rounded-xl border border-border/60 hover:border-primary/30 bg-muted/10 hover:bg-primary/5 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-card border border-border/60 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-all shrink-0">
                      <suite.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary flex items-center gap-1">
                        {suite.label} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{suite.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card space-y-4">
              <h3 className="font-bold text-foreground text-sm">Report Operations</h3>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Export complete executive financial audits or schedule automated reports based on this dataset.
                </p>
                <Link href="/dashboard/reports" className="btn-primary w-full text-xs py-2 justify-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Compile & Export PDF
                </Link>
                <div className="border-t border-border/50 pt-3 text-[11px] text-muted-foreground flex justify-between">
                  <span>Last clean scan:</span>
                  <span className="font-semibold text-foreground font-mono">{activeDataset?.uploadedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
