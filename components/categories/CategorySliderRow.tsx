"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";

export type SliderNominee = {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  current_votes: number;
};

export type CategoryForSlider = {
  id: string;
  name: string;
  nominees: SliderNominee[];
};

export default function CategorySliderRow({ category }: { category: CategoryForSlider }) {
  // Sort nominees by votes (highest first)
  const sortedNominees = [...category.nominees].sort(
    (a, b) => b.current_votes - a.current_votes
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="font-heading font-bold text-gray-900 text-lg">
          {category.name}
        </h2>
        <Link 
          href={`/categories/${category.id}`}
          className="text-sm font-body font-medium text-nacos-green hover:text-nacos-dark transition-colors"
        >
          View Full Category &rarr;
        </Link>
      </div>
      
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 hide-scrollbar">
        {sortedNominees.map((nominee, index) => {
          const rank = index + 1;
          return (
            <Link 
              key={nominee.id}
              href={`/nominee/${nominee.slug}`}
              className="snap-start flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 group"
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full flex flex-col items-center justify-center hover:shadow-md hover:border-nacos-green/30 transition-all duration-200">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full mb-3 bg-gray-50 flex items-center justify-center border-2 border-gray-100 group-hover:border-nacos-green/30 transition-colors">
                  <div className={`absolute -top-1 -left-1 md:top-0 md:left-0 z-10 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full text-[10px] md:text-xs font-bold text-white shadow-md border-2 border-white ${rank === 1 ? 'bg-yellow-500' : 'bg-gray-800'}`}>
                    #{rank}
                  </div>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {nominee.image_url ? (
                      <Image 
                        src={nominee.image_url} 
                        alt={nominee.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={32} className="text-gray-300" />
                    )}
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-gray-900 text-sm md:text-base text-center line-clamp-2 group-hover:text-nacos-green transition-colors">
                  {nominee.name}
                </h3>
                <p className="text-[13px] md:text-sm font-bold text-nacos-green mt-1">
                  {nominee.current_votes || 0} Votes
                </p>
              </div>
            </Link>
          );
        })}
        {sortedNominees.length === 0 && (
          <div className="w-full text-center py-8 text-gray-400 font-body text-sm border border-dashed border-gray-200 rounded-2xl">
            No nominees for this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
