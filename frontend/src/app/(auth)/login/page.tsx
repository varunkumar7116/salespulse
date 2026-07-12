"use client";
// app/(auth)/login/page.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Zap, BarChart3, TrendingUp, Brain, ArrowRight, Lock, Mail, User, ShieldCheck, Check } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2 inline-block shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("register") === "true" ? "register" : "login";
    }
    return "login";
  });
  const [email, setEmail] = useState("admin@salespulse.ai");
  const [password, setPassword] = useState("admin123");
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Google Modal States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState("");
  const [googleCustomName, setGoogleCustomName] = useState("");
  const [showCustomGoogleForm, setShowCustomGoogleForm] = useState(false);

  const { login, registerUser, loginWithGoogle } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = login(email, password);
    if (result.success) {
      document.cookie = "token=mock-token; path=/; max-age=86400; SameSite=Lax";
      toast.success("Successfully logged in!");
      router.push("/dashboard");
    } else {
      setError(result.error || "Invalid credentials");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !inviteCode) {
      toast.error("Please fill in all registration fields.");
      return;
    }

    if (inviteCode.trim().toUpperCase() !== "SALESPULSE-2026") {
      toast.error("Invalid Corporate Invitation Code. Use 'SALESPULSE-2026'.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    
    const result = registerUser(name, email, password);
    if (result.success) {
      document.cookie = "token=mock-token; path=/; max-age=86400; SameSite=Lax";
      toast.success("Account registered successfully! Loading workspace...");
      router.push("/dashboard");
    } else {
      setError(result.error || "Registration failed.");
      setLoading(false);
    }
  };

  const handleGoogleSelect = async (selectedEmail: string, selectedName: string) => {
    setGoogleLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    
    loginWithGoogle(selectedEmail, selectedName);
    document.cookie = "token=mock-token; path=/; max-age=86400; SameSite=Lax";
    
    toast.success(`Signed in as ${selectedName} via Google!`);
    setShowGoogleModal(false);
    setGoogleLoading(false);
    router.push("/dashboard");
  };

  const handleGoogleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleCustomEmail || !googleCustomName) {
      toast.error("Please fill in email and name.");
      return;
    }
    handleGoogleSelect(googleCustomEmail, googleCustomName);
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden relative">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
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

      {/* Right — Login / Register Form */}
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
            <h2 className="text-3xl font-bold text-foreground">
              {activeTab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeTab === "login"
                ? "Sign in to access your analytics dashboard"
                : "Register your corporate analytics profile"}
            </p>
          </div>

          {/* Switcher Tab Control */}
          <div className="grid grid-cols-2 p-1 bg-muted/50 border border-border/55 rounded-xl">
            <button
              onClick={() => {
                setActiveTab("login");
                setError("");
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "login"
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setError("");
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "register"
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Forms */}
          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
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

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base relative overflow-hidden group"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground">Corporate Invite Code</label>
                  <span className="text-[10px] text-muted-foreground italic">Use SALESPULSE-2026</span>
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="SALESPULSE-2026"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base relative overflow-hidden group mt-2"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Register
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>
          )}

          {/* Social Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border/50"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-border/50"></div>
          </div>

          {/* Google SSO Button */}
          <button
            onClick={() => setShowGoogleModal(true)}
            className="w-full flex items-center justify-center px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-foreground text-sm font-semibold hover:bg-muted/40 transition-colors shadow-sm group active:scale-[0.99]"
          >
            <GoogleIcon />
            <span>Sign In with Google</span>
          </button>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/30">
            <Link href="/forgot-password" className="hover:text-primary transition-colors">
              Forgot password?
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Google Simulated OAuth Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md transition-all animate-fade-in">
          <div className="w-full max-w-md p-8 card bg-card border border-border shadow-2xl space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            {googleLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-semibold text-foreground animate-pulse">
                  Connecting to Google Accounts...
                </p>
                <p className="text-xs text-muted-foreground">Provisioning secure account container</p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="text-center space-y-2">
                  <div className="flex justify-center mb-1">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Sign in with Google</h3>
                  <p className="text-xs text-muted-foreground">
                    Choose a mock Google Account to continue to <span className="font-semibold">SalesPulse AI</span>
                  </p>
                </div>

                {/* Simulated Google Accounts */}
                {!showCustomGoogleForm ? (
                  <div className="space-y-2.5">
                    {[
                      { name: "Sarah Jenkins", email: "sarah.jenkins@gmail.com", avatar: "SJ", color: "from-pink-500 to-rose-500" },
                      { name: "Alex Chen", email: "alex.chen@gmail.com", avatar: "AC", color: "from-indigo-500 to-blue-500" },
                    ].map((gUser) => (
                      <button
                        key={gUser.email}
                        onClick={() => handleGoogleSelect(gUser.email, gUser.name)}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/10 hover:bg-muted/40 text-left transition-all active:scale-[0.99] hover:-translate-y-0.5 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gUser.color} flex items-center justify-center text-white text-xs font-bold`}>
                            {gUser.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{gUser.name}</p>
                            <p className="text-xs text-muted-foreground">{gUser.email}</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 font-bold px-2 py-0.5 rounded-full">
                          Google Auth
                        </span>
                      </button>
                    ))}

                    <button
                      onClick={() => setShowCustomGoogleForm(true)}
                      className="w-full p-3.5 rounded-xl border border-dashed border-border bg-transparent hover:bg-muted/20 text-center text-xs font-semibold text-muted-foreground transition-all hover:text-foreground"
                    >
                      + Use another account
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleGoogleCustomSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        placeholder="Elon Musk"
                        value={googleCustomName}
                        onChange={(e) => setGoogleCustomName(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Google Email Address</label>
                      <input
                        type="email"
                        placeholder="elon@tesla.com"
                        value={googleCustomEmail}
                        onChange={(e) => setGoogleCustomEmail(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCustomGoogleForm(false)}
                        className="flex-1 btn-secondary text-xs py-2"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 btn-primary text-xs py-2"
                      >
                        Sign In
                      </button>
                    </div>
                  </form>
                )}

                {/* Informational Disclaimer */}
                <div className="bg-muted/30 border border-border/50 rounded-xl p-3.5 text-[11px] text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-foreground mb-1">🔐 Developer Sandbox Note:</p>
                  To connect your real Google Client ID, configure the Google Identity provider script inside <code className="px-1 py-0.5 bg-muted rounded font-mono">layout.tsx</code> and supply your client ID as <code className="px-1 py-0.5 bg-muted rounded font-mono">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code>.
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      setShowGoogleModal(false);
                      setShowCustomGoogleForm(false);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
