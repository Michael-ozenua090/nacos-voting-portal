import TopAppBar from "@/components/layout/TopAppBar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import LiveLeaderboardSnippet from "@/components/home/LiveLeaderboardSnippet";
import CategoryBentoGrid from "@/components/home/CategoryBentoGrid";
import { Search } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <TopAppBar />
      <main className="pb-20 md:pb-0 w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start pt-4 lg:pt-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <HeroSection />

            {/* Search bar */}
            <div className="px-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="home-search"
                  type="search"
                  placeholder="Search nominees or categories..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green shadow-sm transition-all"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Live Leaderboard snippet */}
            <LiveLeaderboardSnippet />
          </div>
        </div>

        {/* Category grid */}
        <CategoryBentoGrid />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
