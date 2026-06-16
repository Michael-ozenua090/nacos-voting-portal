import Link from "next/link";
import { BarChart2 } from "lucide-react";
import VoteProgressBar from "@/components/ui/VoteProgressBar";
import { createClient } from "@/utils/supabase/server";

const formatVotes = (votes: number): string => {
  if (votes >= 1000000) return (votes / 1000000).toFixed(1) + "m";
  if (votes >= 1000) return (votes / 1000).toFixed(1) + "k";
  return votes.toString();
};

export default async function LiveLeaderboardSnippet() {
  const supabase = await createClient();

  // Fetch first 2 categories with their nominations and contestants
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
          slug
        )
      )
    `)
    .limit(2);

  const validCategories = categories || [];

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
          Live data
        </span>
      </div>

      <div className="space-y-3">
        {validCategories.map((category) => {
          const sortedNoms = [...(category.nominations || [])].sort(
            (a: { current_votes: number | null }, b: { current_votes: number | null }) =>
              (b.current_votes || 0) - (a.current_votes || 0)
          );
          const topThree = sortedNoms.slice(0, 3);
          const maxVotes = topThree[0]?.current_votes || 1;

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
                {topThree.map((nom: any, idx: number) => {
                  const contestant = nom.contestants;
                  if (!contestant) return null;
                  const rank = idx + 1;
                  const votes = nom.current_votes || 0;
                  return (
                    <div key={nom.id} className="flex items-center gap-3">
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
                          <Link
                            href={`/nominee/${contestant.slug}`}
                            className="text-sm font-body font-medium text-gray-800 truncate hover:text-nacos-green transition-colors"
                          >
                            {contestant.name}
                          </Link>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                            <span className="text-sm font-heading font-bold text-gray-700 tabular-nums">
                              {formatVotes(votes)}
                            </span>
                          </div>
                        </div>
                        <VoteProgressBar value={votes} max={maxVotes} />
                      </div>
                    </div>
                  );
                })}
                {topThree.length === 0 && (
                  <p className="text-sm text-gray-500 font-body text-center py-2">
                    No nominations yet.
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {validCategories.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-sm text-gray-500 font-body">No categories available yet.</p>
          </div>
        )}
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
