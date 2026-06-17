"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, LogIn, AlertTriangle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("return_to") ?? "/admin/dashboard";
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error && data.user) {
      setTimeout(() => {
        router.refresh();
        router.push(returnTo);
      }, 1000);
    } else {
      setError(error?.message || "Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-8 pt-10 pb-7 text-center border-b border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-nacos-green rounded-2xl shadow-lg mb-5" style={{ boxShadow: '0 8px 24px rgba(0,135,81,0.3)' }}>
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-gray-900">
              Admin Panel
            </h1>
            <p className="text-gray-400 font-body text-sm mt-1">
              NACOS Awards Management Suite
            </p>
          </div>

          {/* Conditional Form / Reveal Button */}
          {!isFormOpen ? (
            <div className="px-8 py-10 flex flex-col items-center">
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full flex items-center justify-center gap-2.5 text-white font-heading font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md hover:bg-nacos-dark"
                style={{ background: '#008751', boxShadow: '0 8px 20px rgba(0,135,81,0.25)' }}
              >
                <LogIn size={18} />
                Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="px-8 py-7 space-y-5">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-body">
                  <AlertTriangle size={15} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="admin-email" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@nacos.org.ng"
                    required
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all"
                    style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="admin-password" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all"
                    style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
                  />
                  <button
                    type="button"
                    id="admin-toggle-password"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="admin-login-btn"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 text-white font-heading font-semibold py-4 rounded-2xl transition-all duration-200 disabled:opacity-60 mt-2"
                style={{ background: isLoading ? '#006b3f' : '#008751', boxShadow: '0 8px 20px rgba(0,135,81,0.25)' }}
                onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#006b3f'; }}
                onMouseLeave={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#008751'; }}
              >
                <LogIn size={18} />
                {isLoading ? "Authenticating..." : "Secure Login"}
              </button>
            </form>
          )}

          {/* Warning footer */}
          <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 flex items-center justify-center gap-2">
            <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />
            <span className="text-xs font-bold font-body text-red-500 uppercase tracking-widest">
              Executive Access Only
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
