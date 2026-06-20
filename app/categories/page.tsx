import HomeSearchInputClient from "@/components/home/HomeSearchInputClient";
import type { Metadata } from "next";
import { Suspense } from "react";
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

  // Pre-compute stats server-side so the client component is pure/presentational
  const categoriesWithStats: CategoryWithStats[] = validCategories.map(
    (cat) => {
      const nominations = cat.nominations || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalVotes = nominations.reduce(
        (sum: number, nom: any) =>
          sum + (nom.current_votes || 0),
        0
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nominees = nominations.map((nom: any) => ({
        id: nom.contestants?.id || '',
        name: nom.contestants?.name || 'Unknown',
        slug: nom.contestants?.slug || '',
        image_url: nom.contestants?.image_url || null,
        current_votes: nom.current_votes || 0,
      })).filter((n: any) => n.id);

      return {
        id: cat.id,
        name: cat.name,
        description: cat.description ?? null,
        nomineeCount: nominations.length,
        totalVotes,
        nominees,
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
        <Suspense fallback={<div className="h-20" />}>
          <div className="mt-4 mb-6 -mx-4 sm:mx-0">
            <HomeSearchInputClient />
          </div>
        </Suspense>

        {/* Client component owns sort state and renders the grid */}
        <Suspense fallback={<div className="h-20" />}>
          <CategoriesClientPage categories={categoriesWithStats} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
