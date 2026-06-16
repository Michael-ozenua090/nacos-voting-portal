import { BarChart2, TrendingUp, Search } from "lucide-react";
import type { Metadata } from "next";
import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import LivePulse from "@/components/ui/LivePulse";
import VoteProgressBar from "@/components/ui/VoteProgressBar";
import {
  categories,
  getNomineeById,
  formatVotes,
} from "@/lib/mockData";

export const metadata: Metadata = {
  title: "Standings Leaderboard",
  description: "Live vote standings across all NACOS Award Night categories.",
};

export default function LeaderboardPage() {
  const totalVotes = categories
    .flatMap((c) => c.nominees)
    .reduce((sum, n) => sum + n.votes, 0);

  const mostActiveCategory = categories.reduce((prev, cur) => {
    const prevTotal = prev.nominees.reduce((s, n) => s + n.votes, 0);
    const curTotal = cur.nominees.reduce((s, n) => s + n.votes, 0);
    return curTotal > prevTotal ? cur : prev;
  });

  return (
    <>
      <TopAppBar />
      <main className="pb-24 md:pb-8 w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Live badge */}
        <div className="flex items-center gap-3 mb-2">
          <LivePulse color="red" label="Live Updates" />
          <span className="text-xs text-gray-400 font-body">
            Last updated: Just now
          </span>
        </div>

        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-nacos-green mb-5">
          Standings Leaderboard
        </h1>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="leaderboard-search"
            type="search"
            placeholder="Search category or nominee..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green shadow-sm"
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400 mb-1">
              Total Votes Cast
            </p>
            <p className="font-heading font-bold text-2xl text-nacos-green">
              {formatVotes(totalVotes)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-[10px] font-bold font-body uppercase tracking-widest text-gray-400 mb-1">
              Most Active Category
            </p>
            <p className="font-heading font-bold text-sm text-gray-900 leading-tight">
              {mostActiveCategory.name}
            </p>
          </div>
        </div>

        {/* Category leaderboard cards */}
        <div className="space-y-4">
          {categories.map((category) => {
            const sorted = [...category.nominees].sort(
              (a, b) => b.votes - a.votes
            );
            const topThree = sorted.slice(0, 3);
            const maxVotes = topThree[0]?.votes ?? 1;

            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Category header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-50">
                  <h2 className="font-heading font-semibold text-gray-900 text-[15px]">
                    {category.name}
                  </h2>
                </div>

                {/* Nominees */}
                <div className="p-4 space-y-4">
                  {topThree.map((entry, idx) => {
                    const nominee = getNomineeById(entry.nomineeId);
                    if (!nominee) return null;
                    const rank = idx + 1;
                    const percentage = Math.round(
                      (entry.votes / maxVotes) * 100
                    );

                    return (
                      <div key={entry.nomineeId} className="flex items-center gap-3">
                        {/* Rank */}
                        <span
                          className={`w-6 font-heading font-bold text-base flex-shrink-0 ${
                            rank === 1
                              ? "text-nacos-gold"
                              : rank === 2
                              ? "text-gray-400"
                              : "text-amber-600"
                          }`}
                        >
                          {rank}
                        </span>

                        {/* Avatar */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm flex-shrink-0 ${
                            rank === 1
                              ? "bg-nacos-gold text-gray-900"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {nominee.initials}
                        </div>

                        {/* Name + bar */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-sm font-body font-semibold text-gray-800 truncate">
                                {nominee.name.split(" ")[0]}{" "}
                                {nominee.name.split(" ").slice(1).join(" ")[0]}.
                              </span>
                              {rank === 1 && (
                                <span className="text-[10px] font-bold font-body text-nacos-green bg-nacos-green/10 px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                                  LEADING
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {entry.trending && (
                                <TrendingUp size={12} className="text-nacos-green" />
                              )}
                              <span
                                className={`font-heading font-bold text-sm tabular-nums ${
                                  rank === 1
                                    ? "text-nacos-green"
                                    : "text-gray-700"
                                }`}
                              >
                                {formatVotes(entry.votes)}
                              </span>
                            </div>
                          </div>
                          <VoteProgressBar value={entry.votes} max={maxVotes} />
                          {entry.trending && (
                            <p className="text-[10px] font-bold font-body text-nacos-green mt-0.5 flex items-center gap-0.5">
                              <TrendingUp size={9} />
                              TRENDING
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View full button */}
                <div className="px-4 pb-4">
                  <a
                    href={`/categories/${category.id}`}
                    className="block w-full border border-gray-200 text-nacos-green font-heading font-semibold py-2.5 rounded-xl text-sm text-center hover:bg-nacos-green hover:text-white hover:border-nacos-green transition-all duration-200"
                  >
                    View Full Standings
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
