import Image from "next/image";
import LivePulse from "@/components/ui/LivePulse";

export default function HeroSection() {
  return (
    <section className="relative mx-4 mt-4 rounded-3xl overflow-hidden shadow-xl min-h-[300px] flex flex-col justify-end">
      {/* Background image */}
      <Image
        src="/hero-bg.png"
        alt="NACOS Awards Night atmosphere"
        fill
        className="object-cover"
        priority={true}
        sizes="(max-width: 1024px) 100vw, 80vw"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />

      {/* Content */}
      <div className="relative z-10 p-6 pb-7">
        <div className="mb-3">
          <LivePulse color="red" label="Live Voting Open" />
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white leading-tight mb-2">
          NACOS Dinner
          <br />
          &amp; Award Night
        </h1>
        <p className="text-white/80 text-sm font-body mb-5 max-w-xs">
          Celebrate excellence in technology and lifestyle. Cast your vote for the best and brightest.
        </p>

        {/* CTA pill */}
        <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-lg">
          <span className="text-xl">💳</span>
          <span className="font-heading font-bold text-gray-900 text-base">
            1 Vote = ₦100
          </span>
        </div>
      </div>
    </section>
  );
}
