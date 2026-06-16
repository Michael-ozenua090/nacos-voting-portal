"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, Plus, UserPlus, Pencil, Trash2 } from "lucide-react";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import AdminBottomNav from "@/components/admin/AdminBottomNav";
import { categories, getNomineeById, formatVotes } from "@/lib/mockData";

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TopAppBar isAdmin />
      <main className="pb-24 md:pb-8 max-w-2xl mx-auto px-4 pt-4">
        {/* Page heading */}
        <div className="mb-5">
          <h1 className="font-heading font-bold text-2xl text-gray-900">
            Category Management
          </h1>
          <p className="text-gray-400 font-body text-sm mt-0.5">
            Manage award categories, nominees, and voting status.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="admin-categories-search"
            type="search"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green shadow-sm"
          />
        </div>

        {/* Add category button */}
        <button
          id="admin-add-category-btn"
          className="w-full flex items-center justify-center gap-2 bg-nacos-green hover:bg-nacos-dark text-white font-heading font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-md shadow-nacos-green/25 mb-6"
        >
          <Plus size={18} />
          Add Category
        </button>

        {/* Category cards */}
        <div className="space-y-4">
          {filtered.map((category) => {
            const sortedNominees = [...category.nominees].sort(
              (a, b) => b.votes - a.votes
            );

            return (
              <div
                key={category.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Category header */}
                <div className="px-5 pt-5 pb-4 border-b border-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="font-heading font-bold text-lg text-gray-900 leading-tight max-w-[70%]">
                      {category.name}
                    </h2>
                    {/* Live badge */}
                    {category.isLive && (
                      <span className="inline-flex items-center gap-1.5 bg-nacos-gold/20 border border-nacos-gold/40 text-gray-700 text-xs font-bold font-body px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 live-pulse" />
                        Live
                      </span>
                    )}
                  </div>

                  {/* Action icons */}
                  <div className="flex items-center gap-1">
                    <button
                      id={`admin-add-nominee-${category.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-500 hover:text-nacos-green hover:bg-nacos-green/10 transition-colors text-xs font-body"
                      aria-label={`Add nominee to ${category.name}`}
                    >
                      <UserPlus size={15} />
                    </button>
                    <button
                      id={`admin-edit-${category.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors text-xs font-body"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      id={`admin-delete-${category.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors text-xs font-body"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Nominees table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="text-left px-5 py-2.5 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                          Nominee
                        </th>
                        <th className="text-left px-3 py-2.5 text-xs font-bold font-body text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                          Institution
                        </th>
                        <th className="text-right px-5 py-2.5 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                          Votes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {sortedNominees.map((entry) => {
                        const nominee = getNomineeById(entry.nomineeId);
                        if (!nominee) return null;
                        return (
                          <tr
                            key={entry.nomineeId}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            {/* Nominee name + avatar */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                  <Image
                                    src={nominee.imageUrl}
                                    alt={nominee.name}
                                    fill
                                    className="object-cover object-top"
                                    sizes="32px"
                                  />
                                </div>
                                <span className="font-body font-medium text-gray-800 text-[13px] whitespace-nowrap">
                                  {nominee.name
                                    .split(" ")
                                    .map((n, i) =>
                                      i === 0
                                        ? n
                                        : `${n[0]}.`
                                    )
                                    .join(" ")}
                                </span>
                              </div>
                            </td>
                            {/* Institution */}
                            <td className="px-3 py-3.5 hidden sm:table-cell">
                              <span className="font-body text-[13px] text-gray-500 line-clamp-1">
                                {nominee.institution}
                              </span>
                            </td>
                            {/* Votes */}
                            <td className="px-5 py-3.5 text-right">
                              <span className="font-heading font-bold text-nacos-green text-base tabular-nums">
                                {formatVotes(entry.votes)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 font-body">
              <p className="text-4xl mb-3">📂</p>
              <p>No categories match your search.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <AdminBottomNav />
    </>
  );
}
