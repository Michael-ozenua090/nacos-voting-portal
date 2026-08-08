"use client";

import Image from "next/image";
import { Share2, Monitor } from "lucide-react";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";

// Formats a large number (e.g., 1200 -> 1.2k)
export const formatVotes = (votes: number): string => {
  if (votes >= 1000000) return (votes / 1000000).toFixed(1) + "m";
  if (votes >= 1000) return (votes / 1000).toFixed(1) + "k";
  return votes.toString();
};

interface NomineeProps {
  name: string;
  imageUrl: string | null;
  quote: string | null;
  levelDept: string;
}

interface CategoryProps {
  nominationId: string;
  currentVotes: number;
  categoryId: string;
  name: string;
  description: string;
}

interface VoteModalState {
  open: boolean;
  category: CategoryProps | null;
}

export default function NomineeProfileClient({
  nominee,
  categories,
}: {
  nominee: NomineeProps;
  categories: CategoryProps[];
}) {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `Vote for ${nominee.name}`, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const fallbackImage = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61";

  return (
    <>
      <main className="pb-24 lg:pb-8 w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Campaign hero card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center bg-gradient-to-b from-nacos-green/5 to-white">
            {/* Photo */}
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-lg mb-4 ring-4 ring-white">
              <Image
                src={nominee.imageUrl || fallbackImage}
                alt={nominee.name}
                fill
                className="object-cover object-top"
                sizes="112px"
                priority
                unoptimized
              />
            </div>

            {/* Name */}
            <h1 className="font-heading font-bold text-2xl text-nacos-green mb-1">
              Vote for {nominee.name}!
            </h1>

            {/* Quote */}
            <blockquote className="text-gray-500 font-body text-sm italic leading-relaxed max-w-xs mb-5">
              &ldquo;{nominee.quote || "Support me to win this award!"}&rdquo;
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
          {categories.map((category) => {
            const Icon = Monitor; // Using a default icon since DB doesn't have an icon column

            return (
              <div
                key={category.categoryId}
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
                          {formatVotes(category.currentVotes)} Votes
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-body mt-0.5 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Voting Closed badge */}
                  <div
                    aria-label="Voting is closed"
                    className="w-full bg-gray-100 text-gray-400 font-heading font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed select-none"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Voting Closed
                  </div>
                </div>
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="text-sm text-gray-500 font-body text-center py-6">
              No categories nominated yet.
            </p>
          )}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
