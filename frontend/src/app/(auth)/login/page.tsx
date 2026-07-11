"use client";
// app/(auth)/login/page.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Zap, BarChart3, TrendingUp, Brain, ArrowRight, Lock, Mail } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@salespulse.ai");
  const [password, setPassword] = useState("admin123");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = login(email, password);
    if (result.success) {
      document.cookie = "token=mock-token; path=/; max-age=86400; SameSite=Lax";
      router.push("/dashboard");
    } else {
      setError(result.error || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute top-0 left-0 w-full h-full bg-dot opacity-30" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-chart-5/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3 animate-slide-in-left">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">SalesPulse AI</p>
            <p className="text-xs text-muted-foreground">Business Intelligence Platform</p>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative space-y-8">
          <div className="space-y-4 animate-slide-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              AI-Powered Analytics
            </div>
            <h1 className="text-4xl font-extrabold text-foreground leading-tight">
              Transform Your Business Data into{" "}
              <span className="text-gradient">Actionable Insights</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Upload your CSV or Excel files and instantly get KPI dashboards, sales forecasts, customer analytics, AI recommendations, and much more.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-3 animate-slide-in-up delay-200">
            {[
              { icon: BarChart3, label: "18+ Analytics Modules", color: "text-primary" },
              { icon: TrendingUp, label: "ML-Powered Forecasting", color: "text-success" },
              { icon: Brain, label: "AI Business Insights", color: "text-chart-5" },
              { icon: Zap, label: "Instant Data Processing", color: "text-warning" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/50">
                <f.icon className={`w-4 h-4 shrink-0 ${f.color}`} />
                <span className="text-xs font-medium text-foreground">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-4 animate-slide-in-up delay-300">
          {[
            { label: "Analytics Modules", value: "18+" },
            { label: "Chart Types", value: "14" },
            { label: "ML Models", value: "5" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-gradient">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-scale-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">SalesPulse AI</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to access your analytics dashboard</p>
          </div>

          {/* Demo Credentials Box */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs font-semibold text-primary mb-2">🎯 Demo Credentials</p>
            <div className="space-y-1 text-xs text-muted-foreground font-mono">
              <p>Email: <span className="text-foreground">admin@salespulse.ai</span></p>
              <p>Password: <span className="text-foreground">admin123</span></p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@salespulse.ai"
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base relative overflow-hidden group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>

            <div className="flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="text-muted-foreground hover:text-primary transition-colors">
                Forgot password?
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                ← Back to home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
