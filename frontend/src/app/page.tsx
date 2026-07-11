"use client";
// app/page.tsx — Landing Page

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight, BarChart3, Brain, TrendingUp, Package, Users,
  DollarSign, Upload, Zap, Star, ChevronRight, Check, Play,
  Shield, Activity, FileText, Globe, Cpu
} from "lucide-react";

const FEATURES = [
  { icon: Upload, title: "Smart Data Upload", desc: "Drag & drop CSV or Excel files. Auto-detects columns, cleans data, and removes duplicates instantly.", color: "text-primary", bg: "bg-primary/10" },
  { icon: BarChart3, title: "14 Chart Types", desc: "Bar, Line, Pie, Heatmap, Treemap, Waterfall, Sunburst, Radar, Gauge, Scatter, and more.", color: "text-chart-5", bg: "bg-chart-5/10" },
  { icon: Brain, title: "AI Business Insights", desc: "Rule-based AI engine explains why sales changed, identifies risks, and provides actionable recommendations.", color: "text-chart-4", bg: "bg-chart-4/10" },
  { icon: TrendingUp, title: "ML Forecasting", desc: "Linear regression forecasting with confidence intervals to predict future sales and revenue.", color: "text-success", bg: "bg-success/10" },
  { icon: Users, title: "Customer Analytics", desc: "RFM analysis, CLV, churn prediction, demographic insights, and customer segmentation.", color: "text-warning", bg: "bg-warning/10" },
  { icon: Package, title: "Inventory Management", desc: "Real-time stock levels, dead stock detection, reorder alerts, and supplier performance tracking.", color: "text-chart-6", bg: "bg-chart-6/10" },
  { icon: FileText, title: "Report Generator", desc: "Export PDF, Excel, and CSV reports. Executive summaries, monthly reports, and annual reviews.", color: "text-chart-7", bg: "bg-chart-7/10" },
  { icon: Shield, title: "Secure & Private", desc: "All data processing happens in your browser. Your data never leaves your device.", color: "text-chart-2", bg: "bg-chart-2/10" },
];

const MODULES = [
  { label: "KPI Dashboard", icon: Activity },
  { label: "Sales Analytics", icon: BarChart3 },
  { label: "Product Analysis", icon: Package },
  { label: "Customer Analytics", icon: Users },
  { label: "Profit Analysis", icon: DollarSign },
  { label: "Inventory", icon: Package },
  { label: "Forecasting", icon: TrendingUp },
  { label: "AI Insights", icon: Brain },
];

const STATS = [
  { value: "18+", label: "Analytics Modules" },
  { value: "14", label: "Chart Types" },
  { value: "5", label: "ML Models" },
  { value: "100%", label: "Browser-Based" },
];

export default function LandingPage() {
  const [currentModule, setCurrentModule] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentModule((m) => (m + 1) % MODULES.length), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Header ─────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">SalesPulse AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#modules" className="hover:text-foreground transition-colors">Modules</a>
            <a href="#workflow" className="hover:text-foreground transition-colors">How It Works</a>
          </nav>
          <Link href="/login" className="btn-primary">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-dot opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-20 left-10 w-48 h-48 bg-chart-5/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-20 right-10 w-64 h-64 bg-chart-4/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/5 text-primary text-xs font-semibold mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            AI Business Intelligence Platform — No Backend Required
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-in-up">
            Turn Raw Data Into{" "}
            <span className="text-gradient">Business Gold</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-in-up delay-100">
            Upload your CSV or Excel file and instantly get KPI dashboards, sales forecasts, customer analytics, AI-powered recommendations, and downloadable reports — all running in your browser.
          </p>

          {/* Animated module ticker */}
          <div className="flex items-center justify-center gap-3 mb-10 animate-slide-in-up delay-200">
            <span className="text-sm text-muted-foreground">Currently analyzing:</span>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
              {(() => { const M = MODULES[currentModule]; return <M.icon className="w-4 h-4 text-primary" />; })()}
              <span className="text-sm font-semibold text-foreground transition-all">{MODULES[currentModule].label}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-up delay-300">
            <Link href="/login" className="btn-primary px-8 py-4 text-base group">
              Start Analyzing Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="btn-secondary px-8 py-4 text-base gap-2">
              <Play className="w-4 h-4 text-primary" />
              View Live Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground animate-fade-in delay-400">
            {["No signup required", "Data stays in browser", "Free to use"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-success" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────── */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={s.label} className={`text-center animate-slide-in-up delay-${(i + 1) * 100}`}>
              <p className="text-3xl font-extrabold text-gradient">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground">Everything You Need to Understand Your Business</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              A complete analytics suite from data upload to AI-powered recommendations — no database, no setup required.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card-hover p-6 space-y-4 animate-slide-in-up`}
                style={{ animationDelay: `${i * 75}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules Grid ───────────────────────── */}
      <section id="modules" className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground">18 Powerful Modules</h2>
            <p className="text-muted-foreground mt-4">Every aspect of your business, analyzed and visualized</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Authentication & Security", "Dataset Upload & Validation", "Automatic Data Cleaning",
              "Data Profiling", "KPI Dashboard", "Sales Analytics",
              "Product Analytics", "Customer Analytics", "Profit Analysis",
              "Inventory Analytics", "ML Forecasting", "AI Business Insights",
              "Smart Alerts", "Interactive Charts", "Report Generator",
              "Global Search", "Notification Center", "Settings & Themes",
            ].map((m, i) => (
              <div key={m} className={`flex items-center gap-2.5 p-3.5 rounded-xl bg-muted/20 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default animate-fade-in`} style={{ animationDelay: `${i * 50}ms` }}>
                <Check className="w-4 h-4 text-success shrink-0" />
                <span className="text-sm font-medium text-foreground">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow ───────────────────────────── */}
      <section id="workflow" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-4">From raw data to business insights in seconds</p>
          </div>
          <div className="space-y-4">
            {[
              { step: "01", title: "Upload Your Data", desc: "Drag & drop a CSV or Excel file. We support up to 100MB files with auto column detection.", icon: Upload },
              { step: "02", title: "Automatic Cleaning", desc: "Duplicates removed, missing values filled, formats normalized. You get a cleaning report with quality score.", icon: Zap },
              { step: "03", title: "Analytics Generated", desc: "KPIs, sales trends, product rankings, customer segments, profit analysis — computed instantly.", icon: BarChart3 },
              { step: "04", title: "AI Reads All Results", desc: "The AI engine analyzes all metrics and generates executive summaries, SWOT analysis, and recommendations.", icon: Brain },
              { step: "05", title: "Export Reports", desc: "Download PDF, Excel, or CSV reports. Share insights with your team or stakeholders.", icon: FileText },
            ].map((s, i) => (
              <div key={s.step} className={`flex items-start gap-6 p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all animate-slide-in-left`} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono font-bold text-primary">STEP {s.step}</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
                {i < 4 && <ChevronRight className="w-5 h-5 text-muted-foreground/30 shrink-0 mt-3 rotate-90" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-chart-5/5" />
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 glow-primary">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-extrabold text-foreground mb-4">Ready to Unlock Your Business Potential?</h2>
          <p className="text-muted-foreground mb-8 text-lg">Start analyzing your business data in seconds. No setup, no database, no cost.</p>
          <Link href="/login" className="btn-primary px-10 py-4 text-lg group inline-flex">
            Launch Platform
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-xs text-muted-foreground mt-4">Use demo credentials: admin@salespulse.ai / admin123</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground">SalesPulse AI</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} SalesPulse AI — AI Business Intelligence Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            <span>•</span>
            <span>Built with Next.js + TypeScript</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
