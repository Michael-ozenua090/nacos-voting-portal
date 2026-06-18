"use client";

import { useState } from "react";
import Link from "next/link";
import { Monitor, ArrowUpDown, ArrowDownAZ } from "lucide-react";

export type CategoryWithStats = {
  id: string;
  name: string;
  description: string | null;
  nomineeCount: number;
  totalVotes: number;
};

type SortOrder = "votes" | "alpha";

export default function CategoriesClientPage({
  categories,
}: {
  categories: CategoryWithStats[];
}) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("votes");

  const sorted = [...categories].sort((a, b) =>
    sortOrder === "votes"
      ? b.totalVotes - a.totalVotes
      : a.name.localeCompare(b.name)
  );

  return (
    <>
      {/* Sort controls */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500 font-body">
          {categories.length} award{" "}
          {categories.length === 1 ? "category" : "categories"} · Voting is
          live
        </p>

        <div
          className="inline-flex items-center gap-1 bg-gray-100 rounded-xl p-1"
          role="group"
          aria-label="Sort order"
        >
          <button
            id="categories-sort-votes"
            onClick={() => setSortOrder("votes")}
            aria-pressed={sortOrder === "votes"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all duration-150 ${
              sortOrder === "votes"
                ? "bg-white text-nacos-green shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ArrowUpDown size={12} />
            Highest Votes
          </button>
          <button
            id="categories-sort-alpha"
            onClick={() => setSortOrder("alpha")}
            aria-pressed={sortOrder === "alpha"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all duration-150 ${
              sortOrder === "alpha"
                ? "bg-white text-nacos-green shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ArrowDownAZ size={12} />
            A–Z
          </button>
        </div>
      </div>

      {/* Categories list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sorted.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            id={`category-card-${category.id}`}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md hover:border-nacos-green/30 transition-all duration-200 group"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-nacos-green/10 text-nacos-green">
              <Monitor size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-gray-900 text-sm group-hover:text-nacos-green transition-colors truncate">
                {category.name}
              </h3>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                {category.nomineeCount}{" "}
                {category.nomineeCount === 1 ? "nominee" : "nominees"} ·{" "}
                {category.totalVotes.toLocaleString()} votes
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300 group-hover:text-nacos-green transition-colors flex-shrink-0"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-16 text-gray-400 font-body">
          <p className="text-4xl mb-3">🔍</p>
          <p>No categories available yet.</p>
        </div>
      )}
    </>
  );
}
