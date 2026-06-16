"use client";

import Image from "next/image";
import { useState } from "react";
import { Share2, Monitor, Crown, Code2, Lightbulb, Shirt, GraduationCap, Trophy, Sparkles, Laptop } from "lucide-react";
import { notFound } from "next/navigation";
import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import VoteModal from "@/components/voting/VoteModal";
import {
  getNomineeBySlug,
  getCategoriesForNominee,
  getCategoryById,
  getVotesForNomineeInCategory,
  formatVotes,
  nominees,
} from "@/lib/mockData";
import type { Category, Nominee } from "@/lib/mockData";

const iconMap: Record<string, React.ElementType> = {
  Monitor, Crown, Code2, Lightbulb, Shirt, GraduationCap, Trophy, Sparkles, Laptop,
};

interface VoteModalState {
  open: boolean;
  category: Category | null;
}

// This is a client component so we receive slug via props
export default function NomineeProfileClient({
  slug,
}: {
  slug: string;
}) {
  const nominee = getNomineeBySlug(slug);
  if (!nominee) return notFound();

  const nominatedCategories = getCategoriesForNominee(nominee.id);
  const [modal, setModal] = useState<VoteModalState>({
    open: false,
    category: null,
  });

  const openModal = (category: Category) => {
    setModal({ open: true, category });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `Vote for ${nominee.name}`, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <>
      <TopAppBar />
      <main className="pb-24 md:pb-8 max-w-2xl mx-auto px-4 pt-4">
        {/* Campaign hero card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center bg-gradient-to-b from-nacos-green/5 to-white">
            {/* Photo */}
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-lg mb-4 ring-4 ring-white">
              <Image
                src={nominee.imageUrl}
                alt={nominee.name}
                fill
                className="object-cover object-top"
                sizes="112px"
                priority
              />
            </div>

            {/* Name */}
            <h1 className="font-heading font-bold text-2xl text-nacos-green mb-1">
              Vote for {nominee.name}!
            </h1>

            {/* Quote */}
            <blockquote className="text-gray-500 font-body text-sm italic leading-relaxed max-w-xs mb-5">
              &ldquo;{nominee.quote}&rdquo;
            </blockquote>

            {/* Share button */}
            <button
              id="nominee-share-btn"
              onClick={handleShare}
              className="flex items-center gap-2 bg-nacos-green hover:bg-nacos-dark text-white font-heading font-semibold px-5 py-3 rounded-xl text-sm transition-all duration-200 shadow-md shadow-nacos-green/25"
            >
              <Share2 size={16} />
              Share Campaign
            </button>
          </div>
        </div>

        {/* Nominated categories */}
        <h2 className="font-heading font-bold text-gray-900 text-lg mb-3">
          Nominated Categories
        </h2>

        <div className="space-y-3">
          {nominatedCategories.map((category) => {
            const Icon = iconMap[category.icon] ?? Monitor;
            const votes = getVotesForNomineeInCategory(nominee.id, category.id);

            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-nacos-green/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-nacos-green" />
                    </div>

                    {/* Category info + vote badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading font-semibold text-gray-900 text-[15px] leading-tight">
                          {category.name}
                        </h3>
                        {/* Gold vote badge */}
                        <span className="flex-shrink-0 bg-nacos-gold rounded-full px-2.5 py-1 text-xs font-bold font-body text-gray-800 flex items-center gap-1 whitespace-nowrap">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          {formatVotes(votes)} Votes
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-body mt-0.5 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Vote button */}
                  <button
                    id={`nominee-vote-${category.id}`}
                    onClick={() => openModal(category)}
                    className="w-full border border-gray-200 hover:border-nacos-green hover:bg-nacos-green hover:text-white text-nacos-green font-heading font-semibold py-2.5 rounded-xl text-sm transition-all duration-200"
                  >
                    Vote Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
      <BottomNav />

      {/* VoteModal — receives correct category context for each nomination */}
      {modal.category && (
        <VoteModal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, category: null })}
          nominee={nominee}
          category={modal.category}
        />
      )}
    </>
  );
}
