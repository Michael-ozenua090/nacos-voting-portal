import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  CreditCard,
  Vote,
  Trophy,
  User,
  Radio,
} from "lucide-react";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import StatCard from "@/components/admin/StatCard";
import TransactionTable from "@/components/admin/TransactionTable";
import AdminBottomNav from "@/components/admin/AdminBottomNav";
import VoteProgressBar from "@/components/ui/VoteProgressBar";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "michaelozenua090@gmail.com";

export const metadata: Metadata = {
  title: "Dashboard Overview | NACOS Admin",
  description: "Real-time voting and revenue metrics for NACOS Awards.",
};

const formatNaira = (amount: number): string =>
  `₦${amount.toLocaleString("en-NG")}`;

const formatVotes = (votes: number): string =>
  votes.toLocaleString("en-NG");

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // --- Auth Guard: Email Whitelist ---
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  const isSuperAdmin = user?.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

  // --- Live Metric Queries ---

  // 1. Total Revenue — sum of successful transaction amounts
  const { data: revenueRows } = await supabase
    .from("transactions")
    .select("amount")
    .eq("status", "successful");
  const totalRevenue = (revenueRows || []).reduce(
    (sum: number, row: { amount: number }) => sum + (row.amount || 0),
    0
  );

  // 2. Total Votes Cast — sum of successful transaction vote counts
  const { data: voteRows } = await supabase
    .from("transactions")
    .select("number_of_votes")
    .eq("status", "successful");
  const totalVotes = (voteRows || []).reduce(
    (sum: number, row: { number_of_votes: number }) => sum + (row.number_of_votes || 0),
    0
  );

  // 3. Contestant Count
  const { count: contestantCount } = await supabase
    .from("contestants")
    .select("id", { count: "exact", head: true });

  // 4. Category Count
  const { count: categoryCount } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true });

  // 5. System Status — voting_open boolean
  const { data: settings } = await supabase
    .from("system_settings")
    .select("voting_open")
    .single();
  const isVotingOpen = settings?.voting_open ?? false;

  // 6. Top Category by total votes
  const { data: categoriesWithNoms } = await supabase
    .from("categories")
    .select(`
      name,
      nominations ( current_votes )
    `);
  let topCategoryName = "N/A";
  let topCategoryVotes = 0;
  let maxTotalVotes = 1; // for progress bar denominator
  for (const cat of categoriesWithNoms || []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const catVotes = ((cat as any).nominations || []).reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (s: number, n: any) => s + (n.current_votes || 0),
      0
    );
    if (catVotes > topCategoryVotes) {
      topCategoryVotes = catVotes;
      topCategoryName = cat.name;
    }
    if (catVotes > maxTotalVotes) maxTotalVotes = catVotes;
  }

  // 7. Top Student (contestant with the most total nomination votes)
  const { data: nominations } = await supabase
    .from("nominations")
    .select(`
      current_votes,
      contestants ( name )
    `);
  let topStudentName = "N/A";
  let topStudentVotes = 0;
  const studentMap: Record<string, number> = {};
  for (const nom of nominations || []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const name = (nom as any).contestants?.name;
    if (!name) continue;
    studentMap[name] = (studentMap[name] || 0) + (nom.current_votes || 0);
  }
  for (const [name, votes] of Object.entries(studentMap)) {
    if (votes > topStudentVotes) {
      topStudentVotes = votes;
      topStudentName = name;
    }
  }
  // Generate initials
  const nameParts = topStudentName.split(" ");
  const initials = ((nameParts[0]?.[0] || "") + (nameParts[1]?.[0] || "")).toUpperCase();

  // 8. Granular Analytics: Revenue & Votes by Category / Nominee
  const { data: successfulTxns } = await supabase
    .from("transactions")
    .select(`
      amount,
      number_of_votes,
      nominations (
        contestants (name),
        categories (name)
      )
    `)
    .eq("status", "successful");

  const revByCat: Record<string, { votes: number; amount: number }> = {};
  const revByNom: Record<string, { category: string; votes: number; amount: number }> = {};

  for (const txn of successfulTxns || []) {
    const amount = txn.amount || 0;
    const votes = txn.number_of_votes || 0;
    // @ts-ignore
    const catName = txn.nominations?.categories?.name || "Unknown Category";
    // @ts-ignore
    const nomName = txn.nominations?.contestants?.name || "Unknown Nominee";

    if (!revByCat[catName]) revByCat[catName] = { votes: 0, amount: 0 };
    revByCat[catName].votes += votes;
    revByCat[catName].amount += amount;

    if (!revByNom[nomName]) revByNom[nomName] = { category: catName, votes: 0, amount: 0 };
    revByNom[nomName].votes += votes;
    revByNom[nomName].amount += amount;
  }

  const sortedCatStats = Object.entries(revByCat).sort((a, b) => b[1].amount - a[1].amount);
  const sortedNomStats = Object.entries(revByNom).sort((a, b) => b[1].amount - a[1].amount);

  return (
    <>
      <TopAppBar isAdmin isSuperAdmin={isSuperAdmin} />
      <main className="pb-24 md:pb-8 w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Revenue */}
          {isSuperAdmin && (
            <StatCard
              title="Total Revenue"
              iconBg="bg-nacos-gold/20"
              icon={<CreditCard size={20} className="text-amber-600" />}
            >
              <p className="font-heading font-bold text-3xl text-gray-900">
                {formatNaira(totalRevenue)}
              </p>
              <p className="text-xs font-body text-gray-400 mt-1 flex items-center gap-1">
                From {(revenueRows || []).length} successful payments
              </p>
            </StatCard>
          )}

          {/* Total Votes */}
          <StatCard
            title="Total Votes"
            iconBg="bg-nacos-green/10"
            icon={<Vote size={20} className="text-nacos-green" />}
          >
            <p className="font-heading font-bold text-3xl text-gray-900">
              {formatVotes(totalVotes)}
            </p>
            <p className="text-xs font-body text-gray-400 mt-1 flex items-center gap-1">
              <User size={11} />
              {contestantCount ?? 0} contestants · {categoryCount ?? 0} categories
            </p>
          </StatCard>

          {/* System Status */}
          <StatCard
            title="System Status"
            iconBg={isVotingOpen ? "bg-nacos-green/10" : "bg-red-50"}
            icon={<Radio size={20} className={isVotingOpen ? "text-nacos-green" : "text-red-500"} />}
          >
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-body ${
                  isVotingOpen
                    ? "bg-nacos-green/10 text-nacos-green"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isVotingOpen ? "bg-nacos-green animate-pulse" : "bg-red-500"
                  }`}
                />
                {isVotingOpen ? "Live" : "Paused"}
              </span>
            </div>
            <p className="text-xs font-body text-gray-400 mt-2">
              Voting is currently {isVotingOpen ? "open" : "closed"}
            </p>
          </StatCard>

          {/* Top Category */}
          <StatCard
            title="Top Category"
            iconBg="bg-gray-100"
            icon={<Trophy size={20} className="text-gray-600" />}
          >
            <p className="font-heading font-bold text-xl text-gray-900 mb-2">
              {topCategoryName}
            </p>
            <VoteProgressBar
              value={topCategoryVotes}
              max={maxTotalVotes}
              size="md"
              showLabel
            />
            <p className="text-xs text-gray-400 font-body mt-1 text-right">
              {formatVotes(topCategoryVotes)} total votes
            </p>
          </StatCard>
        </div>

        {/* Granular Analytics Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance by Category */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-heading font-bold text-gray-900 text-[15px]">
                Performance by Category
              </h2>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                Total revenue and votes aggregated per category.
              </p>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-gray-50 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="text-right px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">Total Votes</th>
                    {isSuperAdmin && (
                      <th className="text-right px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">Revenue</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedCatStats.length === 0 && (
                    <tr>
                      <td colSpan={isSuperAdmin ? 3 : 2} className="px-5 py-8 text-center text-gray-400 font-body text-sm">No data available yet.</td>
                    </tr>
                  )}
                  {sortedCatStats.map(([catName, stats]) => (
                    <tr key={catName} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-body font-medium text-gray-800 text-[13px]">{catName}</td>
                      <td className="px-5 py-4 text-right font-heading font-bold text-gray-900 text-[13px]">{formatVotes(stats.votes)}</td>
                      {isSuperAdmin && (
                        <td className="px-5 py-4 text-right font-heading font-bold text-nacos-green text-[13px]">{formatNaira(stats.amount)}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance by Nominee */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 pt-5 pb-3">
              <h2 className="font-heading font-bold text-gray-900 text-[15px]">
                Performance by Nominee
              </h2>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                Top earners across all categories.
              </p>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-gray-50 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">Nominee</th>
                    <th className="text-right px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">Total Votes</th>
                    {isSuperAdmin && (
                      <th className="text-right px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">Revenue</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedNomStats.length === 0 && (
                    <tr>
                      <td colSpan={isSuperAdmin ? 3 : 2} className="px-5 py-8 text-center text-gray-400 font-body text-sm">No data available yet.</td>
                    </tr>
                  )}
                  {sortedNomStats.map(([nomName, stats]) => (
                    <tr key={nomName} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 min-w-[150px]">
                        <p className="font-body font-medium text-gray-800 text-[13px] truncate">{nomName}</p>
                        <p className="text-[11px] text-gray-400 font-body truncate">{stats.category}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-heading font-bold text-gray-900 text-[13px]">{formatVotes(stats.votes)}</td>
                      {isSuperAdmin && (
                        <td className="px-5 py-4 text-right font-heading font-bold text-nacos-green text-[13px]">{formatNaira(stats.amount)}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        {isSuperAdmin && <TransactionTable />}
      </main>
      <Footer />
      <AdminBottomNav />
    </>
  );
}
