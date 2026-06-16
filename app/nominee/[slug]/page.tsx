import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NomineeProfileClient from "@/components/voting/NomineeProfileClient";
import { createClient } from "@/utils/supabase/server";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60; // Revalidate every 60 seconds or use dynamic rendering


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: nominee } = await supabase
    .from("contestants")
    .select("name, campaign_quote")
    .eq("slug", slug)
    .single();

  if (!nominee) return { title: "Nominee Not Found" };
  
  return {
    title: `Vote for ${nominee.name}`,
    description: nominee.campaign_quote,
  };
}

export default async function NomineePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch Contestant
  const { data: nominee } = await supabase
    .from("contestants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!nominee) notFound();

  // 2. Fetch Nominations and joined Categories
  const { data: nominations } = await supabase
    .from("nominations")
    .select(`
      id,
      current_votes,
      categories (
        id,
        name,
        description
      )
    `)
    .eq("contestant_id", nominee.id);

  // Parse and map data for the client component
  const mappedCategories = (nominations || []).map((nom: {
    id: string;
    current_votes: number | null;
    categories: {
      id: string;
      name: string;
      description: string | null;
    } | null;
  }) => ({
    nominationId: nom.id,
    currentVotes: nom.current_votes,
    categoryId: nom.categories.id,
    name: nom.categories.name,
    description: nom.categories.description,
  }));

  const nomineeData = {
    name: nominee.name,
    imageUrl: nominee.image_url,
    quote: nominee.campaign_quote,
    levelDept: nominee.level_dept,
  };

  return <NomineeProfileClient nominee={nomineeData} categories={mappedCategories} />;
}
