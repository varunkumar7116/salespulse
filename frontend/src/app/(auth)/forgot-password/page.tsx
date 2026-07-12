"use client";
// app/(auth)/forgot-password/page.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowRight, Mail, Key } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setIsSent(true);
    toast.success("Password reset instructions sent to your email!");
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Left Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute top-0 left-0 w-full h-full bg-dot opacity-30" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">SalesPulse</p>
            <p className="text-xs text-muted-foreground">Internal Portal</p>
          </div>
        </div>

        <div className="relative space-y-4 max-w-md animate-slide-in-up">
          <h1 className="text-3xl font-extrabold text-foreground leading-tight">
            Forgot Your Security Key?
          </h1>
          <p className="text-muted-foreground">
            Provide your registered corporate email address and we will dispatch temporary access tokens to restore your access profile.
          </p>
        </div>

        <div className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} SalesPulse. Authorized access only.
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-8 animate-scale-in">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">Reset Password</h2>
            <p className="mt-2 text-sm text-muted-foreground">Get recovery links sent to your inbox</p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@salespulse.com"
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
                    Requesting Recovery...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Send Recovery Email
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>

              <div className="text-center text-sm text-muted-foreground mt-4">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Sign In
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center lg:text-left">
              <div className="p-4 rounded-xl bg-success/5 border border-success/20 text-success text-sm leading-relaxed">
                🚀 We have sent a recovery email to <strong>{email}</strong>. Please check your inbox and spam folders for instructions to reset your account password.
              </div>

              <Link href="/login" className="w-full btn-secondary py-3 text-sm justify-center">
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
