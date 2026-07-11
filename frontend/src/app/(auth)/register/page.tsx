"use client";
// app/(auth)/register/page.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowRight, Mail, Lock, User, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !inviteCode) {
      toast.error("Please fill in all registration fields.");
      return;
    }

    // Verify company authorization key
    if (inviteCode.trim().toUpperCase() !== "SALESPULSE-2026") {
      toast.error("Invalid Corporate Invitation Code. Contact administration.");
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));

    // For the demo we directly log in as the default admin
    const result = login("admin@salespulse.ai", "admin123");
    
    if (result.success) {
      document.cookie = "token=mock-token; path=/; max-age=86400; SameSite=Lax";
      toast.success("Account registered successfully! Loading workspace...");
      router.push("/dashboard");
    } else {
      toast.error("Registration failed. Please check credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute top-0 left-0 w-full h-full bg-dot opacity-30" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />

        <div className="relative flex items-center gap-3 animate-slide-in-left">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">SalesPulse AI</p>
            <p className="text-xs text-muted-foreground">Authorized Portal</p>
          </div>
        </div>

        <div className="relative space-y-4 max-w-md animate-slide-in-up">
          <h1 className="text-3xl font-extrabold text-foreground leading-tight">
            Register corporate analytics profiles.
          </h1>
          <p className="text-muted-foreground">
            Sign up with your corporate email and authorization key to gain access to predictive sales forecasting, multi-regional revenue mapping, and business insights.
          </p>
        </div>

        <div className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} SalesPulse AI. Authorized access only.
        </div>
      </div>

      {/* Right — Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-scale-in">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">Create account</h2>
            <p className="mt-2 text-sm text-muted-foreground">Register your corporate analytics profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="text-sm font-medium text-foreground">Corporate Invite Code</label>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base relative overflow-hidden group mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Register
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>

            <div className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
