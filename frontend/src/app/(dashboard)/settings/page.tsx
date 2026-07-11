"use client";
// app/(dashboard)/settings/page.tsx

import React, { useState } from "react";
import {
  Settings, User, Lock, Bell, Volume2, Globe,
  ShieldCheck, Palette, HelpCircle, Check
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState("en");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");

  const [notifUpload, setNotifUpload] = useState(true);
  const [notifForecast, setNotifForecast] = useState(true);
  const [notifStock, setNotifStock] = useState(true);

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    toast.success(`Theme switched to ${newTheme} mode!`);
  };

  const handleSave = () => {
    toast.success("Preferences saved successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="section-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Manage UI themes, currency formatting, languages and warning alerts alerts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Category Links */}
        <div className="space-y-2">
          {[
            { label: "Preferences & Localization", icon: Globe },
            { label: "Alert Notification Centers", icon: Bell },
            { label: "User Account & Role controls", icon: User },
            { label: "System Security Credentials", icon: ShieldCheck }
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold hover:bg-muted text-left transition-all ${
                idx === 0 ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Configuration forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Preferences */}
          <div className="card space-y-6">
            <div>
              <h3 className="font-semibold text-foreground">Localization & Layout</h3>
              <p className="text-xs text-muted-foreground">Adjust local currencies, language scopes, and dates format</p>
            </div>

            <div className="space-y-4">
              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">UI Style Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "dark", label: "Midnight Dark" },
                    { value: "light", label: "Light Theme" }
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => handleThemeChange(t.value as any)}
                      className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                        theme === t.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted/10 text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <span>{t.label}</span>
                      {theme === t.value && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lang, Currency and Date Format */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">UI LANGUAGE</label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full bg-input border border-border p-2.5 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Spanish (ES)</option>
                    <option value="de">German (DE)</option>
                    <option value="fr">French (FR)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">CURRENCY SYMBOL</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-input border border-border p-2.5 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">DATE FORMAT</label>
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full bg-input border border-border p-2.5 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications config */}
          <div className="card space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">Alert Warning Options</h3>
              <p className="text-xs text-muted-foreground">Select what notifications you'd like to get triggered</p>
            </div>

            <div className="space-y-3">
              {[
                { label: "ETL Sheet upload confirmation logs", value: notifUpload, setValue: setNotifUpload },
                { label: "AI predictive forecast calculations completion", value: notifForecast, setValue: setNotifForecast },
                { label: "Inventory low stock and dead stock trigger warnings", value: notifStock, setValue: setNotifStock }
              ].map((notif, index) => (
                <div key={index} className="flex items-center justify-between text-xs py-1 border-b border-border/40 pb-2">
                  <span className="text-muted-foreground font-medium">{notif.label}</span>
                  <button
                    onClick={() => notif.setValue(!notif.value)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-all ${notif.value ? "bg-primary" : "bg-muted"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all transform ${notif.value ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <button className="btn-secondary text-xs">Reset Defaults</button>
            <button onClick={handleSave} className="btn-primary text-xs px-6">Save Preferences</button>
          </div>
        </div>
      </div>
    </div>
  );
}
