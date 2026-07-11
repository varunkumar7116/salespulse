"use client";
// app/(dashboard)/insights/page.tsx

import React, { useState } from "react";
import Link from "next/link";
import {
  Brain, Send, Search, HelpCircle, AlertTriangle, CheckCircle, Info,
  TrendingUp, Compass, Award, Lightbulb, AlertCircle
} from "lucide-react";
import { useDatasetStore } from "@/store/dataset-store";
import { answerNLQ } from "@/lib/ai-insights";

export default function InsightsPage() {
  const { kpis, sales, products, customers, insights, activeDatasetId } = useDatasetStore();
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{ q: string; a: string }[]>([]);

  const hasData = !!kpis && !!activeDatasetId && !!insights;

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !kpis) return;

    const answer = answerNLQ(query, kpis, sales || undefined, products || undefined, customers || undefined);
    setChatHistory([...chatHistory, { q: query, a: answer }]);
    setQuery("");
  };

  const handleQuickQuery = (qText: string) => {
    if (!kpis) return;
    const answer = answerNLQ(qText, kpis, sales || undefined, products || undefined, customers || undefined);
    setChatHistory([...chatHistory, { q: qText, a: answer }]);
  };

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Brain className="w-12 h-12 text-muted-foreground/40 animate-pulse" />
        <h2 className="text-xl font-bold text-foreground">No AI Insights Profiles Loaded</h2>
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
          <h1 className="page-title">AI Business Insights</h1>
          <p className="page-subtitle">Narrative summaries, SWOT analysis, and natural language analytics queries</p>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="card border-primary/20 bg-primary/5 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
        <div className="flex items-center gap-2.5">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Executive AI Summary</h2>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">{insights.executiveSummary}</p>
      </div>

      {/* Natural Language Search / Chat */}
      <div className="card space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">Natural Language Query (Smart Analytics Assistant)</h3>
          <p className="text-xs text-muted-foreground">Ask questions about your business in normal plain English text</p>
        </div>

        {/* Conversation History */}
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {chatHistory.map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground text-sm py-2 px-3.5 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                  {item.q}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-muted text-foreground text-sm py-3 px-4 rounded-2xl rounded-tl-sm max-w-[80%] border border-border whitespace-pre-line leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggest Buttons */}
        {chatHistory.length === 0 && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">SUGGESTED QUESTIONS</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Show top 10 products",
                "Which region has highest sales?",
                "Why is profit decreasing?",
                "What should I improve?",
                "Predict next month's sales"
              ].map((qText) => (
                <button
                  key={qText}
                  onClick={() => handleQuickQuery(qText)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-xs text-foreground hover:bg-muted transition-all"
                >
                  {qText}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input box */}
        <form onSubmit={handleQuerySubmit} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about products, regional sales, margins, or forecasts..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary px-4 shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* SWOT Grid */}
      <div className="card space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">SWOT Diagnostics Matrix</h3>
          <p className="text-xs text-muted-foreground">Strategic outline based on analyzed dataset metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-success/5 border border-success/20 rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-success flex items-center gap-1.5">
              <Award className="w-4 h-4" /> STRENGTHS (Internal)
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
              {insights.swot.strengths.slice(0, 4).map((s) => (
                <li key={s} className="leading-relaxed">{s}</li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-destructive/5 border border-destructive/20 rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-destructive flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> WEAKNESSES (Internal)
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
              {insights.swot.weaknesses.slice(0, 4).map((w) => (
                <li key={w} className="leading-relaxed">{w}</li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-primary flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> OPPORTUNITIES (External)
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
              {insights.swot.opportunities.slice(0, 4).map((o) => (
                <li key={o} className="leading-relaxed">{o}</li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-warning/5 border border-warning/20 rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-warning flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> THREATS (External)
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground list-disc pl-4">
              {insights.swot.threats.slice(0, 4).map((t) => (
                <li key={t} className="leading-relaxed">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Actionable recommendations list */}
      <div className="card space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">AI Action Recommendations</h3>
          <p className="text-xs text-muted-foreground">Strategic steps to prioritize based on detected leakages and opportunities</p>
        </div>

        <div className="space-y-3">
          {insights.recommendations.map((rec, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border border-border bg-muted/20 items-start hover:border-primary/30 transition-all">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                rec.priority === "critical" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                rec.priority === "high" ? "bg-warning/10 text-warning border border-warning/20" : "bg-primary/10 text-primary border border-primary/20"
              }`}>
                <Lightbulb className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-foreground">{rec.title}</h4>
                  <span className={`badge uppercase text-[8px] tracking-wider ${
                    rec.priority === "critical" ? "badge-destructive" : rec.priority === "high" ? "badge-warning" : "badge-primary"
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  <span>IMPACT: <span className="text-primary font-extrabold">{rec.expectedImpact}</span></span>
                  <span>ACTION: <span className="text-foreground font-semibold">{rec.action}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
