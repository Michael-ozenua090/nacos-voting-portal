"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Users, ArrowUpDown, ArrowDownAZ } from "lucide-react";
import VoteProgressBar from "@/components/ui/VoteProgressBar";

export type CategoryStat = {
  id: string;
  name: string;
  totalVotes: number;
  nomineeCount: number;
};

export type NomineeStat = {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  totalVotes: number;
  categoryCount: number;
};

type SortOrder = "votes" | "alpha";

const formatVotes = (votes: number): string => {
  if (votes >= 1000000) return (votes / 1000000).toFixed(1) + "m";
  if (votes >= 1000) return (votes / 1000).toFixed(1) + "k";
  return votes.toString();
};

function SortToggle({
  value,
  onChange,
}: {
  value: SortOrder;
  onChange: (v: SortOrder) => void;
}) {
  return (
    <div
      className="inline-flex items-center gap-1 bg-gray-100 rounded-xl p-1"
      role="group"
      aria-label="Sort order"
    >
      <button
        id="sort-by-votes"
        onClick={() => onChange("votes")}
        aria-pressed={value === "votes"}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all duration-150 ${
          value === "votes"
            ? "bg-white text-nacos-green shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <ArrowUpDown size={12} />
        Highest Votes
      </button>
      <button
        id="sort-alphabetically"
        onClick={() => onChange("alpha")}
        aria-pressed={value === "alpha"}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all duration-150 ${
          value === "alpha"
            ? "bg-white text-nacos-green shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <ArrowDownAZ size={12} />
        A–Z
      </button>
    </div>
  );
}

export default function LeaderboardClient({
  categories,
  nominees,
}: {
  categories: CategoryStat[];
  nominees: NomineeStat[];
}) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("votes");

  const sortedCategories = [...categories].sort((a, b) =>
    sortOrder === "votes"
      ? b.totalVotes - a.totalVotes
      : a.name.localeCompare(b.name)
  );

  const sortedNominees = [...nominees].sort((a, b) =>
    sortOrder === "votes"
      ? b.totalVotes - a.totalVotes
      : a.name.localeCompare(b.name)
  );

  const maxCategoryVotes = sortedCategories[0]?.totalVotes || 1;
  const maxNomineeVotes = sortedNominees[0]?.totalVotes || 1;

  const rankColor = (rank: number) =>
    rank === 1
      ? "text-nacos-gold"
      : rank === 2
      ? "text-gray-400"
      : rank === 3
      ? "text-amber-600"
      : "text-gray-300";

  return (
    <div className="space-y-10">
      {/* Global sort control */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-body">
          Sort both lists by:
        </p>
        <SortToggle value={sortOrder} onChange={setSortOrder} />
      </div>

      {/* ── Section 1: Top Categories ── */}
      <section aria-labelledby="top-categories-heading">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-nacos-green/10 flex items-center justify-center flex-shrink-0">
            <Trophy size={16} className="text-nacos-green" />
          </div>
          <h2
            id="top-categories-heading"
            className="font-heading font-bold text-gray-900 text-lg"
          >
            Top Categories
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {sortedCategories.length === 0 ? (
            <p className="text-sm text-gray-500 font-body text-center py-8">
              No categories available yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-50">
              {sortedCategories.map((cat, idx) => {
                const rank = idx + 1;
                return (
                  <div
                    key={cat.id}
                    className="flex items-center gap-4 px-4 py-3"
                  >
                    {/* Rank */}
                    <span
                      className={`w-6 font-heading font-bold text-base flex-shrink-0 ${rankColor(rank)}`}
                    >
                      {rank}
                    </span>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <Link
                          href={`/categories/${cat.id}`}
                          className="text-sm font-body font-semibold text-gray-800 truncate hover:text-nacos-green transition-colors"
                        >
                          {cat.name}
                        </Link>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {rank === 1 && cat.totalVotes > 0 && (
                            <span className="text-[10px] font-bold font-body text-nacos-green bg-nacos-green/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                              HOTTEST
                            </span>
                          )}
                          <span className="font-heading font-bold text-sm tabular-nums text-nacos-green">
                            {formatVotes(cat.totalVotes)}
                          </span>
                        </div>
                      </div>
                      <VoteProgressBar
                        value={cat.totalVotes}
                        max={maxCategoryVotes}
                      />
                      <p className="text-[11px] text-gray-400 font-body mt-1">
                        {cat.nomineeCount}{" "}
                        {cat.nomineeCount === 1 ? "nominee" : "nominees"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Section 2: Top Nominees ── */}
      <section aria-labelledby="top-nominees-heading">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-nacos-gold/10 flex items-center justify-center flex-shrink-0">
            <Users size={16} className="text-nacos-gold" />
          </div>
          <h2
            id="top-nominees-heading"
            className="font-heading font-bold text-gray-900 text-lg"
          >
            Top Nominees
          </h2>
          <span className="text-xs text-gray-400 font-body ml-1">
            (aggregated across all categories)
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {sortedNominees.length === 0 ? (
            <p className="text-sm text-gray-500 font-body text-center py-8">
              No nominees available yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-50">
              {sortedNominees.map((nom, idx) => {
                const rank = idx + 1;
                const nameParts = nom.name.split(" ");
                const initials =
                  (nameParts[0]?.[0] || "") + (nameParts[1]?.[0] || "");

                return (
                  <div
                    key={nom.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    {/* Rank */}
                    <span
                      className={`w-6 font-heading font-bold text-base flex-shrink-0 ${rankColor(rank)}`}
                    >
                      {rank}
                    </span>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {nom.image_url ? (
                        <div className={`w-10 h-10 rounded-full overflow-hidden border-2 flex items-center justify-center ${rank === 1 ? "border-nacos-gold" : "border-gray-100"}`}>
                          <Image 
                            src={nom.image_url} 
                            alt={nom.name} 
                            width={40} 
                            height={40} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-xs ${
                            rank === 1
                              ? "bg-nacos-gold text-gray-900"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {initials.toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Link
                            href={`/nominee/${nom.slug}`}
                            className="text-sm font-body font-semibold text-gray-800 truncate hover:text-nacos-green transition-colors"
                          >
                            {nom.name}
                          </Link>
                          {rank === 1 && nom.totalVotes > 0 && (
                            <span className="text-[10px] font-bold font-body text-nacos-green bg-nacos-green/10 px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                              LEADING
                            </span>
                          )}
                        </div>
                        <span
                          className={`font-heading font-bold text-sm tabular-nums flex-shrink-0 ${
                            rank === 1 ? "text-nacos-green" : "text-gray-700"
                          }`}
                        >
                          {formatVotes(nom.totalVotes)}
                        </span>
                      </div>
                      <VoteProgressBar
                        value={nom.totalVotes}
                        max={maxNomineeVotes}
                      />
                      <p className="text-[11px] text-gray-400 font-body mt-1">
                        Nominated in {nom.categoryCount}{" "}
                        {nom.categoryCount === 1 ? "category" : "categories"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
