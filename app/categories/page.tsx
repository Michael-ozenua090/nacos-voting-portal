"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import { categories, categoryGroups } from "@/lib/mockData";
import { Monitor, Users, BookOpen, Dumbbell, Laptop, Crown, Code2, Lightbulb, Shirt, GraduationCap, Trophy, Sparkles } from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  Monitor, Users, BookOpen, Dumbbell, Laptop, Crown, Code2,
  Lightbulb, Shirt, GraduationCap, Trophy, Sparkles,
};

const groupIconBg: Record<string, string> = {
  "grp-tech": "bg-nacos-green/10 text-nacos-green",
  "grp-social": "bg-emerald-50 text-emerald-600",
  "grp-academic": "bg-gray-100 text-gray-600",
  "grp-sports": "bg-amber-50 text-amber-600",
};

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TopAppBar />
      <main className="pb-24 md:pb-8 max-w-2xl mx-auto px-4 pt-4">
        <h1 className="font-heading font-bold text-2xl text-gray-900 mb-1">
          All Categories
        </h1>
        <p className="text-gray-400 text-sm font-body mb-5">
          {categories.length} award categories · Voting is live
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="categories-search"
            type="search"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green shadow-sm"
          />
        </div>

        {/* Categories by group */}
        {categoryGroups.map((group) => {
          const groupCats = filtered.filter((c) => c.groupId === group.id);
          if (groupCats.length === 0) return null;
          return (
            <div key={group.id} className="mb-6">
              <h2 className="font-heading font-semibold text-gray-700 text-sm uppercase tracking-wider mb-3">
                {group.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {groupCats.map((category) => {
                  const Icon = iconMap[category.icon] ?? Monitor;
                  const iconStyle = groupIconBg[group.id] ?? "bg-nacos-green/10 text-nacos-green";
                  const totalVotes = category.nominees.reduce((s, n) => s + n.votes, 0);
                  return (
                    <Link
                      key={category.id}
                      href={`/categories/${category.id}`}
                      id={`category-card-${category.id}`}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md hover:border-nacos-green/30 transition-all duration-200 group"
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyle}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-gray-900 text-sm group-hover:text-nacos-green transition-colors truncate">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-body mt-0.5">
                          {category.nominees.length} nominees · {totalVotes.toLocaleString()} votes
                        </p>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-nacos-green transition-colors flex-shrink-0" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 font-body">
            <p className="text-4xl mb-3">🔍</p>
            <p>No categories match your search.</p>
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
