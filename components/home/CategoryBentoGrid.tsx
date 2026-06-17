import { createClient } from "@/utils/supabase/server";
import CategoryBentoGridClient from "./CategoryBentoGridClient";

export default async function CategoryBentoGrid() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, description");

  const validCategories = categories || [];

  return <CategoryBentoGridClient initialCategories={validCategories} />;
}
