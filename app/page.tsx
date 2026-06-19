import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import LiveLeaderboardSnippet from "@/components/home/LiveLeaderboardSnippet";
import CategoryBentoGrid from "@/components/home/CategoryBentoGrid";
import HomeSearchInputClient from "@/components/home/HomeSearchInputClient";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <>
      <main className=" w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start pt-4 lg:pt-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Hero */}
            <HeroSection />

            {/* Search bar */}
            <Suspense fallback={<div className="h-20" />}>
              <HomeSearchInputClient />
            </Suspense>
          </div>

          <div className="lg:col-span-1">
            {/* Live Leaderboard snippet */}
            <LiveLeaderboardSnippet />
          </div>
        </div>

        {/* Category grid */}
        <Suspense fallback={<div className="h-20" />}>
          <CategoryBentoGrid />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
