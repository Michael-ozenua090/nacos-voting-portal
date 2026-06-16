import { Search } from "lucide-react";
import type { Metadata } from "next";
import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import LivePulse from "@/components/ui/LivePulse";
import VoteProgressBar from "@/components/ui/VoteProgressBar";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Standings Leaderboard",
  description: "Live vote standings across all NACOS Award Night categories.",
};

// Revalidate every 30 seconds for live-ish feeling without hammering DB too hard
export const revalidate = 30;

const formatVotes = (votes: number): string => {
  if (votes >= 1000000) return (votes / 1000000).toFixed(1) + "m";
  if (votes >= 1000) return (votes / 1000).toFixed(1) + "k";
  return votes.toString();
};

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      nominations (
        id,
        current_votes,
        contestants (
          id,
          name,
          slug,
          image_url
        )
      )
    `);

  const validCategories = categories || [];

  // Calculate stats
  let totalVotes = 0;
  let mostActiveCategory = validCategories[0] || { name: "N/A" };
  let maxCategoryVotes = 0;

  for (const cat of validCategories) {
    const catVotes = (cat.nominations || []).reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, nom: any) => sum + (nom.current_votes || 0),
      0
    );
    totalVotes += catVotes;
    if (catVotes > maxCategoryVotes) {
      maxCategoryVotes = catVotes;
      mostActiveCategory = cat;
    }
  }

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
          {validCategories.map((category) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sortedNoms = [...(category.nominations || [])].sort(
              (a: any, b: any) => (b.current_votes || 0) - (a.current_votes || 0)
            );
            const topThree = sortedNoms.slice(0, 3);
            const maxVotes = topThree[0]?.current_votes || 1; // prevent divide by zero

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
                  {topThree.length === 0 && (
                    <p className="text-sm text-gray-500 font-body text-center py-2">
                      No nominations for this category yet.
                    </p>
                  )}
                  {topThree.map((nom: any, idx: number) => {
                    const contestant = nom.contestants;
                    if (!contestant) return null;
                    const rank = idx + 1;
                    const votes = nom.current_votes || 0;
                    
                    // Simple logic to generate initials
                    const nameParts = contestant.name.split(" ");
                    const initials = (nameParts[0]?.[0] || "") + (nameParts[1]?.[0] || "");

                    return (
                      <div key={nom.id} className="flex items-center gap-3">
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
                          {initials.toUpperCase()}
                        </div>

                        {/* Name + bar */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-sm font-body font-semibold text-gray-800 truncate">
                                <a href={`/nominee/${contestant.slug}`} className="hover:underline">
                                  {nameParts[0]} {nameParts.slice(1).join(" ")[0] || ""}.
                                </a>
                              </span>
                              {rank === 1 && votes > 0 && (
                                <span className="text-[10px] font-bold font-body text-nacos-green bg-nacos-green/10 px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                                  LEADING
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span
                                className={`font-heading font-bold text-sm tabular-nums ${
                                  rank === 1
                                    ? "text-nacos-green"
                                    : "text-gray-700"
                                }`}
                              >
                                {formatVotes(votes)}
                              </span>
                            </div>
                          </div>
                          <VoteProgressBar value={votes} max={maxVotes} />
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
