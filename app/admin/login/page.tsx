import { Suspense } from "react";
import type { Metadata } from "next";
import AdminLoginPage from "./AdminLoginClient";

export const metadata: Metadata = {
  title: "Admin Login | NACOS Awards",
  description: "Secure executive access to the NACOS Awards management suite.",
};

export default function AdminLoginRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-nacos-green border-t-transparent rounded-full animate-spin" /></div>}>
      <AdminLoginPage />
    </Suspense>
  );
}
