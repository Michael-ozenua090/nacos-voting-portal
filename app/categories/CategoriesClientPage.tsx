"use client";

import { useState } from "react";
import Link from "next/link";
import { Monitor, ArrowUpDown, ArrowDownAZ } from "lucide-react";
import { useSearchParams } from "next/navigation";
import CategorySliderRow, { CategoryForSlider } from "@/components/categories/CategorySliderRow";

export type CategoryWithStats = CategoryForSlider & {
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
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  const filtered = categories.filter(cat => 
    cat.name.toLowerCase().includes(query) || 
    cat.description?.toLowerCase().includes(query)
  );

  const sorted = [...filtered].sort((a, b) =>
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
      <div className="flex flex-col gap-10 mt-6">
        {sorted.map((category) => (
          <CategorySliderRow key={category.id} category={category} />
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
