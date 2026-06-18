import { Search } from "lucide-react";
import type { Metadata } from "next";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/server";
import CategoriesClientPage, {
  type CategoryWithStats,
} from "./CategoriesClientPage";

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all NACOS Award Night voting categories.",
};

// Force fresh data on every load — students are voting right now
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const supabase = await createClient();

  // Fetch all categories with nomination counts and votes
  const { data: categories } = await supabase.from("categories").select(`
      id,
      name,
      description,
      nominations (
        id,
        current_votes
      )
    `);

  const validCategories = categories || [];

  // Pre-compute stats server-side so the client component is pure/presentational
  const categoriesWithStats: CategoryWithStats[] = validCategories.map(
    (cat) => {
      const nominations = cat.nominations || [];
      const totalVotes = nominations.reduce(
        (sum: number, nom: { current_votes: number | null }) =>
          sum + (nom.current_votes || 0),
        0
      );
      return {
        id: cat.id,
        name: cat.name,
        description: cat.description ?? null,
        nomineeCount: nominations.length,
        totalVotes,
      };
    }
  );

  return (
    <>
      <TopAppBar />
      <main className="max-w-2xl mx-auto px-4 pt-4 pb-10">
        <h1 className="font-heading font-bold text-2xl text-gray-900 mb-1">
          All Categories
        </h1>

        {/* Search — visual only; full client-side search can be added later */}
        <div className="relative mt-4 mb-6">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="categories-search"
            type="search"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green shadow-sm"
          />
        </div>

        {/* Client component owns sort state and renders the grid */}
        <CategoriesClientPage categories={categoriesWithStats} />
      </main>
      <Footer />
    </>
  );
}
