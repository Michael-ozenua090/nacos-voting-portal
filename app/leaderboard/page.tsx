import { Suspense } from "react";
import type { Metadata } from "next";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import LivePulse from "@/components/ui/LivePulse";
import UrlCleaner from "@/components/ui/UrlCleaner";
import { createClient } from "@/utils/supabase/server";
import LeaderboardClient, {
  type CategoryStat,
  type NomineeStat,
} from "./LeaderboardClient";

// Always fetch fresh vote data — critical for a live voting app
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Standings Leaderboard",
  description: "Live vote standings across all NACOS Award Night categories.",
};

const formatVotes = (votes: number): string => {
  if (votes >= 1000000) return (votes / 1000000).toFixed(1) + "m";
  if (votes >= 1000) return (votes / 1000).toFixed(1) + "k";
  return votes.toString();
};

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Fetch all categories with all nominations + contestant details
  const { data: categories } = await supabase.from("categories").select(`
      id,
      name,
      nominations (
        id,
        current_votes,
        contestants (
          id,
          name,
          slug
        )
      )
    `);

  const validCategories = categories || [];

  // ── Aggregate: Total votes & total nominees per category ──────────────────
  let totalVotes = 0;

  const categoryStats: CategoryStat[] = validCategories.map((cat) => {
    const nominations = cat.nominations || [];
    const catTotal = nominations.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, nom: any) => sum + (nom.current_votes || 0),
      0
    );
    totalVotes += catTotal;
    return {
      id: cat.id,
      name: cat.name,
      totalVotes: catTotal,
      nomineeCount: nominations.length,
    };
  });

  // Most active category (for the stats card)
  const mostActiveCategory = [...categoryStats].sort(
    (a, b) => b.totalVotes - a.totalVotes
  )[0] || { name: "N/A", totalVotes: 0 };

  // ── Aggregate: Sum votes per unique contestant across ALL categories ───────
  // A student may appear in multiple categories; we group by contestant.id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nomineeMap = new Map<string, NomineeStat>();

  for (const cat of validCategories) {
    for (const nom of cat.nominations || []) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contestant = (nom as any).contestants;
      if (!contestant) continue;
      const votes = nom.current_votes || 0;

      if (nomineeMap.has(contestant.id)) {
        const existing = nomineeMap.get(contestant.id)!;
        existing.totalVotes += votes;
        existing.categoryCount += 1;
      } else {
        nomineeMap.set(contestant.id, {
          id: contestant.id,
          name: contestant.name,
          slug: contestant.slug,
          totalVotes: votes,
          categoryCount: 1,
        });
      }
    }
  }

  const nomineeStats: NomineeStat[] = Array.from(nomineeMap.values());

  return (
    <>
      <TopAppBar />
      {/* Silently strip payment redirect params from the URL */}
      <Suspense fallback={null}>
        <UrlCleaner />
      </Suspense>

      <main className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
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

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mb-8">
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

        {/* Client component handles sort state + renders both sections */}
        <LeaderboardClient
          categories={categoryStats}
          nominees={nomineeStats}
        />
      </main>
      <Footer />
    </>
  );
}
