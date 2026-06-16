import type { Metadata } from "next";
import {
  CreditCard,
  Vote,
  Trophy,
  User,
  TrendingUp,
} from "lucide-react";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import StatCard from "@/components/admin/StatCard";
import TransactionTable from "@/components/admin/TransactionTable";
import AdminBottomNav from "@/components/admin/AdminBottomNav";
import VoteProgressBar from "@/components/ui/VoteProgressBar";
import {
  dashboardStats,
  formatCurrency,
  formatVotes,
} from "@/lib/mockData";

export const metadata: Metadata = {
  title: "Dashboard Overview | NACOS Admin",
  description: "Real-time voting and revenue metrics for NACOS Awards.",
};

export default function AdminDashboardPage() {
  return (
    <>
      <TopAppBar isAdmin />
      <main className="pb-24 md:pb-8 max-w-2xl mx-auto px-4 pt-4">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-gray-900">
            Overview
          </h1>
          <p className="text-gray-400 font-body text-sm mt-0.5">
            Real-time voting and revenue metrics.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {/* Total Revenue */}
          <StatCard
            title="Total Revenue"
            iconBg="bg-nacos-gold/20"
            icon={<CreditCard size={20} className="text-amber-600" />}
          >
            <p className="font-heading font-bold text-3xl text-gray-900">
              {formatCurrency(dashboardStats.totalRevenue)}
            </p>
            <p className="text-xs font-body text-nacos-green mt-1 flex items-center gap-1">
              <TrendingUp size={12} />
              {dashboardStats.revenueGrowth}
            </p>
          </StatCard>

          {/* Total Votes */}
          <StatCard
            title="Total Votes"
            iconBg="bg-nacos-green/10"
            icon={<Vote size={20} className="text-nacos-green" />}
          >
            <p className="font-heading font-bold text-3xl text-gray-900">
              {formatVotes(dashboardStats.totalVotes)}
            </p>
            <p className="text-xs font-body text-gray-400 mt-1 flex items-center gap-1">
              <User size={11} />
              Across {dashboardStats.totalCategories} categories
            </p>
          </StatCard>

          {/* Top Category */}
          <StatCard
            title="Top Category"
            iconBg="bg-gray-100"
            icon={<Trophy size={20} className="text-gray-600" />}
          >
            <p className="font-heading font-bold text-xl text-gray-900 mb-2">
              {dashboardStats.topCategoryName}
            </p>
            <VoteProgressBar
              value={dashboardStats.topCategoryActivity}
              max={100}
              size="md"
              showLabel
            />
            <p className="text-xs text-gray-400 font-body mt-1 text-right">
              {dashboardStats.topCategoryActivity}% Activity
            </p>
          </StatCard>

          {/* Top Student */}
          <StatCard
            title="Top Student"
            iconBg="bg-gray-100"
            icon={<User size={20} className="text-gray-600" />}
          >
            <div className="flex items-center gap-3 mt-1">
              <div className="w-10 h-10 rounded-full bg-nacos-gold flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-sm text-gray-900">
                  AJ
                </span>
              </div>
              <div>
                <p className="font-heading font-semibold text-gray-900">
                  {dashboardStats.topStudentName}
                </p>
                <p className="text-xs text-gray-400 font-body">
                  {formatVotes(dashboardStats.topStudentVotes)} Votes
                </p>
              </div>
            </div>
          </StatCard>
        </div>

        {/* Recent Transactions */}
        <TransactionTable />
      </main>
      <Footer />
      <AdminBottomNav />
    </>
  );
}
