import { createClient } from "@/utils/supabase/server";
import CategoryBentoGridClient from "./CategoryBentoGridClient";

export default async function CategoryBentoGrid() {
  const supabase = await createClient();

  // Fetch categories with their nominations so we can rank by total votes
  const { data: categories } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      description,
      nominations (
        current_votes
      )
    `);

  const validCategories = categories || [];

  // Compute total votes per category, sort descending, take top 4
  const topCategories = validCategories
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      totalVotes: (cat.nominations || []).reduce(
        (sum: number, nom: { current_votes: number | null }) =>
          sum + (nom.current_votes || 0),
        0
      ),
    }))
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 4);

  return <CategoryBentoGridClient initialCategories={topCategories} />;
}
