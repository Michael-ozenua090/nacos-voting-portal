import type { Metadata } from "next";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import { User, Trophy } from "lucide-react";
import Link from "next/link";
import { nominees } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "My Profile | NACOS Awards",
  description: "Your NACOS Awards voting profile and activity.",
};

export default function ProfilePage() {
  // Static profile page — shows sample voter profile
  return (
    <>
      <TopAppBar />
      <main className=" max-w-2xl mx-auto px-4 pt-6">
        {/* Profile card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6 text-center">
          <div className="w-20 h-20 rounded-full bg-nacos-green/10 flex items-center justify-center mx-auto mb-4">
            <User size={36} className="text-nacos-green" />
          </div>
          <h1 className="font-heading font-bold text-xl text-gray-900 mb-1">
            Guest Voter
          </h1>
          <p className="text-gray-400 font-body text-sm">
            Sign in to track your votes
          </p>
          <button
            id="profile-signin-btn"
            className="mt-4 bg-nacos-green hover:bg-nacos-dark text-white font-heading font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200"
          >
            Sign In
          </button>
        </div>

        {/* Quick links */}
        <h2 className="font-heading font-semibold text-gray-700 text-sm uppercase tracking-wider mb-3">
          Quick Links
        </h2>
        <div className="space-y-2">
          {[
            { href: "/", label: "Browse Categories", icon: Trophy },
            { href: "/leaderboard", label: "View Leaderboard", icon: Trophy },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3.5 hover:border-nacos-green/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-nacos-green/10 flex items-center justify-center">
                  <Icon size={16} className="text-nacos-green" />
                </div>
                <span className="font-body font-medium text-gray-800 text-sm group-hover:text-nacos-green transition-colors">
                  {label}
                </span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-nacos-green transition-colors" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
