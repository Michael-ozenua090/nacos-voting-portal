import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import NomineeCard from "@/components/voting/NomineeCard";
import LivePulse from "@/components/ui/LivePulse";
import { createClient } from "@/utils/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("id", id)
    .single();

  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch system settings to check if voting is live
  const { data: settings } = await supabase
    .from("system_settings")
    .select("voting_open")
    .single();
  const isLive = settings?.voting_open ?? false;

  // Fetch the category
  const { data: category } = await supabase
    .from("categories")
    .select("id, name, description")
    .eq("id", id)
    .single();

  if (!category) notFound();

  // Fetch the nominations and the related contestants
  const { data: nominations } = await supabase
    .from("nominations")
    .select(`
      id,
      current_votes,
      contestants (
        id,
        name,
        slug,
        level_dept,
        image_url,
        campaign_quote
      )
    `)
    .eq("category_id", category.id)
    .order("current_votes", { ascending: false });

  const sortedNominees = nominations || [];

  return (
    <>
      <TopAppBar />
      <main className=" w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-nacos-green text-sm font-body font-medium mb-4 hover:text-nacos-dark transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        {/* Category header */}
        <div className="flex items-start justify-between mb-2">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900 leading-tight max-w-[70%]">
            {category.name}
          </h1>
          {isLive && <LivePulse color="red" label="LIVE" />}
        </div>
        <p className="text-gray-500 font-body text-sm mb-6">
          {category.description || "Vote for your favorite nominee in this category!"}
        </p>

        {/* Nominees grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedNominees.map((nom: any, idx: number) => {
            const contestant = nom.contestants;
            if (!contestant) return null;
            
            // Map to the shape expected by NomineeCard
            const nomineeData = {
              id: contestant.id,
              name: contestant.name,
              slug: contestant.slug,
              level: contestant.level_dept?.split(" ")[0] || "",
              department: contestant.level_dept?.split(" ").slice(1).join(" ") || "",
              imageUrl: contestant.image_url || "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
            };
            
            const categoryData = {
              id: category.id,
              name: category.name,
            };

            return (
              <NomineeCard
                key={nom.id}
                nominee={nomineeData as any}
                category={categoryData as any}
                nominationId={nom.id}
                votes={nom.current_votes || 0}
                rank={idx + 1}
                priority={idx < 4}
              />
            );
          })}
          
          {sortedNominees.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl">
              <p className="text-gray-500 font-body">No nominees have been added to this category yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
