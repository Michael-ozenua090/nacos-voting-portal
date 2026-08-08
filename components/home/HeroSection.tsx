import Image from "next/image";

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
          {/* Archival badge — replaces the live pulse */}
          <span className="inline-flex items-center gap-1.5 bg-nacos-gold/20 text-nacos-gold text-xs font-heading font-bold px-3 py-1 rounded-full">
            🏆 2026 Edition Complete
          </span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white leading-tight mb-2">
          NACOS Dinner
          <br />
          &amp; Award Night
        </h1>
        <p className="text-white/80 text-sm font-body mb-5 max-w-xs">
          The 2026 edition has concluded. Congratulations to all our winners and thank
          you to everyone who voted and celebrated with us.
        </p>

        {/* Archival info pill */}
        <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-lg">
          <span className="text-xl" aria-hidden="true">🏅</span>
          <span className="font-heading font-bold text-gray-900 text-base">
            Results are final &amp; official
          </span>
        </div>
      </div>
    </section>
  );
}
