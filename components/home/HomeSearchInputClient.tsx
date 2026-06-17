"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function HomeSearchInputClient() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    window.dispatchEvent(new CustomEvent("home-search", { detail: val }));
  };

  return (
    <div className="px-4">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          id="home-search"
          type="search"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green shadow-sm transition-all"
        />
      </div>
    </div>
  );
}
