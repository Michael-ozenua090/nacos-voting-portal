import { Suspense } from "react";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import UrlCleaner from "@/components/ui/UrlCleaner";
import { createClient } from "@/utils/supabase/server";
import LeaderboardClient, {
  type CategoryStat,
  type NomineeStat,
} from "./LeaderboardClient";

// Static archival page — results are final.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Final Results — NACOS Awards 2026",
  description: "The official final vote standings for the NACOS Award Night 2026. Voting has concluded.",
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
          slug,
          image_url
        )
      )
    `);

  const validCategories = categories || [];

  // ── Aggregate: Total votes & total nominees per category ──────────────────
  const categoryStats: CategoryStat[] = validCategories.map((cat) => {
    const nominations = cat.nominations || [];
    const catTotal = nominations.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, nom: any) => sum + (nom.current_votes || 0),
      0
    );
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
          image_url: contestant.image_url,
          totalVotes: votes,
          categoryCount: 1,
        });
      }
    }
  }

  const nomineeStats: NomineeStat[] = Array.from(nomineeMap.values());

  return (
    <>
      {/* Silently strip payment redirect params from the URL */}
      <Suspense fallback={null}>
        <UrlCleaner />
      </Suspense>

      <main className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-nacos-green mb-5">
          Final Results — NACOS Awards 2026
        </h1>

        {/* Celebratory archival banner */}
        <div className="bg-gradient-to-r from-nacos-green/10 via-nacos-gold/10 to-nacos-green/10 border border-nacos-gold/30 rounded-2xl px-5 py-4 mb-8 flex items-center gap-4">
          <span className="text-3xl flex-shrink-0" aria-hidden="true">🏆</span>
          <p className="font-body text-sm text-gray-800 leading-relaxed">
            <span className="font-heading font-bold text-nacos-green block mb-0.5">
              Final Official Results
            </span>
            The 2026 Awards have concluded. Thank you to everyone who participated.
          </p>
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
