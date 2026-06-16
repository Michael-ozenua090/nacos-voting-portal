import Image from "next/image";
import Link from "next/link";
import { Monitor, Users, BookOpen, Dumbbell } from "lucide-react";
import { categoryGroups } from "@/lib/mockData";

const iconMap: Record<string, React.ElementType> = {
  Monitor,
  Users,
  BookOpen,
  Dumbbell,
};

const iconBgColors: Record<string, string> = {
  "grp-tech": "bg-nacos-green",
  "grp-social": "bg-emerald-500",
  "grp-academic": "bg-gray-700",
  "grp-sports": "bg-nacos-gold",
};

export default function CategoryBentoGrid() {
  return (
    <section className="px-4">
      <div className="flex items-center gap-2 mb-4">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#008751"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <h2 className="font-heading font-bold text-gray-900 text-lg">
          Explore Categories
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {categoryGroups.map((group) => {
          const Icon = iconMap[group.icon] ?? Monitor;
          const iconBg = iconBgColors[group.id] ?? "bg-nacos-green";
          const textColor =
            group.id === "grp-sports" ? "text-gray-900" : "text-white";

          return (
            <Link
              key={group.id}
              href={`/categories?group=${group.id}`}
              id={`category-group-${group.id}`}
              className="relative rounded-2xl overflow-hidden h-[110px] flex items-end group shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Background image */}
              <Image
                src={group.imageUrl}
                alt={group.name}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3 p-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
                >
                  <Icon size={18} className={textColor} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-[15px] leading-tight">
                    {group.name}
                  </h3>
                  <p className="text-white/70 text-xs font-body leading-tight mt-0.5">
                    {group.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
