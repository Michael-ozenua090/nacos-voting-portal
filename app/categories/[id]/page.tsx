import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import NomineeCard from "@/components/voting/NomineeCard";
import LivePulse from "@/components/ui/LivePulse";
import CountdownTimer from "@/components/ui/CountdownTimer";
import {
  getCategoryById,
  getNomineeById,
  categories,
} from "@/lib/mockData";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = getCategoryById(id);
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const category = getCategoryById(id);
  if (!category) notFound();

  const sortedNominees = [...category.nominees].sort(
    (a, b) => b.votes - a.votes
  );

  return (
    <>
      <TopAppBar />
      <main className="pb-24 md:pb-8 w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Back link */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-nacos-green text-sm font-body font-medium mb-4 hover:text-nacos-dark transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Categories
        </Link>

        {/* Category header */}
        <div className="flex items-start justify-between mb-2">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900 leading-tight max-w-[70%]">
            {category.name}
          </h1>
          {category.isLive && <LivePulse color="red" label="LIVE" />}
        </div>
        <p className="text-gray-500 font-body text-sm mb-4">
          {category.description}
        </p>

        {/* Countdown */}
        <div className="mb-6">
          <CountdownTimer targetDate={category.votingClosesAt} />
        </div>

        {/* Nominees grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedNominees.map((entry, idx) => {
            const nominee = getNomineeById(entry.nomineeId);
            if (!nominee) return null;
            return (
              <NomineeCard
                key={entry.nomineeId}
                nominee={nominee}
                category={category}
                votes={entry.votes}
                rank={idx + 1}
                priority={idx < 4}
              />
            );
          })}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
