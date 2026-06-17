import Link from "next/link";
import { Search, Monitor } from "lucide-react";
import type { Metadata } from "next";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all NACOS Award Night voting categories.",
};

export const revalidate = 30;

export default async function CategoriesPage() {
  const supabase = await createClient();

  // Fetch all categories with nomination counts
  const { data: categories } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      description,
      nominations (
        id,
        current_votes
      )
    `);

  const validCategories = categories || [];

  return (
    <>
      <TopAppBar />
      <main className=" max-w-2xl mx-auto px-4 pt-4">
        <h1 className="font-heading font-bold text-2xl text-gray-900 mb-1">
          All Categories
        </h1>
        <p className="text-gray-400 text-sm font-body mb-5">
          {validCategories.length} award {validCategories.length === 1 ? "category" : "categories"} · Voting is live
        </p>

        {/* Search - client-side filtering would need a wrapper component,
            for now this is a visual placeholder that links work correctly */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="categories-search"
            type="search"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green shadow-sm"
          />
        </div>

        {/* Categories list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {validCategories.map((category) => {
            const nominations = category.nominations || [];
            const totalVotes = nominations.reduce(
              (sum: number, nom: { current_votes: number | null }) => sum + (nom.current_votes || 0),
              0
            );

            return (
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
                    {nominations.length} {nominations.length === 1 ? "nominee" : "nominees"} · {totalVotes.toLocaleString()} votes
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-nacos-green transition-colors flex-shrink-0" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            );
          })}
        </div>

        {validCategories.length === 0 && (
          <div className="text-center py-16 text-gray-400 font-body">
            <p className="text-4xl mb-3">🔍</p>
            <p>No categories available yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
