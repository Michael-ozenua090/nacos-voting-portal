"use client";

import Link from "next/link";
import { Monitor, LayoutGrid } from "lucide-react";

type CategoryItem = {
  id: string;
  name: string;
  description: string | null;
  totalVotes: number;
};

export default function CategoryBentoGridClient({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const categories = initialCategories || [];

  return (
    <section className="px-4">
      <div className="flex items-center gap-2 mb-4">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#008751"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <h2 className="font-heading font-bold text-gray-900 text-lg">
          Explore Categories
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            id={`category-card-${category.id}`}
            className="relative rounded-2xl overflow-hidden h-[110px] flex items-end group shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-nacos-green to-emerald-700"
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50" />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/20 backdrop-blur-sm">
                <Monitor size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-[15px] leading-tight">
                  {category.name}
                </h3>
                <p className="text-white/70 text-xs font-body leading-tight mt-0.5">
                  {category.description || "Vote for your favourite nominee!"}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl">
            <p className="text-gray-500 font-body">
              No categories available yet.
            </p>
          </div>
        )}
      </div>

      {/* View All Categories button */}
      <div className="mt-6 flex justify-center">
        <Link
          href="/categories"
          id="view-all-categories-btn"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-nacos-green text-nacos-green font-heading font-semibold text-sm hover:bg-nacos-green hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <LayoutGrid size={16} />
          View All Categories
        </Link>
      </div>
    </section>
  );
}
