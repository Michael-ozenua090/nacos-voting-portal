"use client";

import Image from "next/image";
import Link from "next/link";
import { Share2 } from "lucide-react";

const formatVotes = (votes: number): string => {
  if (votes >= 1000000) return (votes / 1000000).toFixed(1) + "m";
  if (votes >= 1000) return (votes / 1000).toFixed(1) + "k";
  return votes.toLocaleString("en-NG");
};

interface NomineeCardProps {
  nominee: {
    id: string;
    slug: string;
    name: string;
    level: string;
    department: string;
    imageUrl: string;
  };
  category: {
    id: string;
    name: string;
  };
  nominationId: string;
  votes: number;
  rank?: number;
  priority?: boolean;
}

export default function NomineeCard({
  nominee,
  category,
  nominationId,
  votes,
  rank,
  priority = false,
}: NomineeCardProps) {

  const handleShare = async () => {
    const url = `${window.location.origin}/nominee/${nominee.slug}`;
    if (navigator.share) {
      await navigator.share({ title: `Vote for ${nominee.name}`, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const fallbackImage = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61";

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
        {/* Photo area */}
        <div className="relative h-56 bg-gray-100">
          <Image
            src={nominee.imageUrl || fallbackImage}
            alt={nominee.name}
            fill
            className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={priority}
            unoptimized
          />
          {/* Vote count badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#008751"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="text-xs font-bold font-heading text-gray-800">
              {formatVotes(votes)}
            </span>
          </div>
          {/* Rank badge */}
          {rank !== undefined && rank <= 3 && (
            <div
              className={`absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center font-heading font-bold text-xs ${
                rank === 1
                  ? "bg-nacos-gold text-gray-900"
                  : rank === 2
                  ? "bg-gray-300 text-gray-800"
                  : "bg-amber-600 text-white"
              }`}
            >
              {rank}
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-1">
            <Link
              href={`/nominee/${nominee.slug}`}
              className="font-heading font-semibold text-gray-900 hover:text-nacos-green transition-colors text-[15px] leading-tight"
            >
              {nominee.name}
            </Link>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-gray-400 hover:text-nacos-green hover:bg-nacos-green/10 transition-colors flex-shrink-0"
              aria-label="Share nominee"
            >
              <Share2 size={14} />
            </button>
          </div>
          <p className="text-xs text-gray-400 font-body mb-3">
            {nominee.level} · {nominee.department}
          </p>
          <div
            aria-label="Voting is closed"
            className="w-full bg-gray-100 text-gray-400 font-heading font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-not-allowed select-none"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Voting Closed
          </div>
        </div>
      </div>
    </>
  );
}
