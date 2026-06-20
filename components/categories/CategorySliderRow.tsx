"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";

export type SliderNominee = {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
};

export type CategoryForSlider = {
  id: string;
  name: string;
  nominees: SliderNominee[];
};

export default function CategorySliderRow({ category }: { category: CategoryForSlider }) {
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
        {category.nominees.map((nominee) => (
          <Link 
            key={nominee.id}
            href={`/nominee/${nominee.slug}`}
            className="snap-start flex-shrink-0 w-40 sm:w-48 group"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full flex flex-col items-center justify-center hover:shadow-md hover:border-nacos-green/30 transition-all duration-200">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 bg-gray-50 flex items-center justify-center border-2 border-gray-100 group-hover:border-nacos-green/30 transition-colors">
                {nominee.image_url ? (
                  <Image 
                    src={nominee.image_url} 
                    alt={nominee.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-gray-300" />
                )}
              </div>
              <h3 className="font-heading font-semibold text-gray-900 text-sm text-center line-clamp-2 group-hover:text-nacos-green transition-colors">
                {nominee.name}
              </h3>
            </div>
          </Link>
        ))}
        {category.nominees.length === 0 && (
          <div className="w-full text-center py-8 text-gray-400 font-body text-sm border border-dashed border-gray-200 rounded-2xl">
            No nominees for this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
