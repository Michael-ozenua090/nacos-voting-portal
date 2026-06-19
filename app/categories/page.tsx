import HomeSearchInputClient from "@/components/home/HomeSearchInputClient";
import type { Metadata } from "next";
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
      <main className="max-w-2xl mx-auto px-4 pt-4 pb-10">
        <h1 className="font-heading font-bold text-2xl text-gray-900 mb-1">
          All Categories
        </h1>

        {/* Interactive Search */}
        <div className="mt-4 mb-6 -mx-4 sm:mx-0">
          <HomeSearchInputClient />
        </div>

        {/* Client component owns sort state and renders the grid */}
        <CategoriesClientPage categories={categoriesWithStats} />
      </main>
      <Footer />
    </>
  );
}
