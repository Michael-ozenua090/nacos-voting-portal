import Link from "next/link";
import { BarChart2, TrendingUp } from "lucide-react";
import {
  categories,
  nominees,
  getNomineeById,
  formatVotes,
} from "@/lib/mockData";
import VoteProgressBar from "@/components/ui/VoteProgressBar";

// Show snippets for Mr. NACOS and Tech Bro of the Year
const FEATURED_CATEGORY_IDS = ["cat-002", "cat-001"];

export default function LiveLeaderboardSnippet() {
  const featuredCategories = FEATURED_CATEGORY_IDS.map((id) =>
    categories.find((c) => c.id === id)
  ).filter(Boolean) as typeof categories;

  return (
    <section className="px-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart2 size={18} className="text-nacos-green" />
          <h2 className="font-heading font-bold text-gray-900 text-lg">
            Live Leaderboard
          </h2>
        </div>
        <span className="text-xs text-gray-400 font-body">
          Last updated 2 mins ago
        </span>
      </div>

      <div className="space-y-3">
        {featuredCategories.map((category) => {
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
              <div className="px-4 pt-3 pb-2 border-b border-gray-50">
                <p className="text-xs font-bold font-body uppercase tracking-widest text-gray-400">
                  {category.name}
                </p>
              </div>
              <div className="p-4 space-y-3">
                {topThree.map((entry, idx) => {
                  const nominee = getNomineeById(entry.nomineeId);
                  if (!nominee) return null;
                  const rank = idx + 1;
                  return (
                    <div key={entry.nomineeId} className="flex items-center gap-3">
                      {/* Rank */}
                      <span
                        className={`w-5 text-sm font-heading font-bold flex-shrink-0 ${
                          rank === 1
                            ? "text-nacos-green"
                            : "text-gray-400"
                        }`}
                      >
                        {rank}
                      </span>

                      {/* Name + bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-body font-medium text-gray-800 truncate">
                            {nominee.name}
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            {entry.trending && (
                              <TrendingUp
                                size={12}
                                className="text-nacos-green"
                              />
                            )}
                            <span className="text-sm font-heading font-bold text-gray-700 tabular-nums">
                              {formatVotes(entry.votes)}
                            </span>
                          </div>
                        </div>
                        <VoteProgressBar value={entry.votes} max={maxVotes} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href="/leaderboard"
        className="block mt-3 text-center text-sm font-body font-medium text-nacos-green hover:text-nacos-dark transition-colors py-2"
      >
        View Full Leaderboard →
      </Link>
    </section>
  );
}
