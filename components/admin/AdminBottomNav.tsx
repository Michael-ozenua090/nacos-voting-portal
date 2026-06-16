"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Trophy, Users, Settings } from "lucide-react";

const adminNavItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/categories", icon: Trophy, label: "Categories" },
  { href: "/admin/members", icon: Users, label: "Members" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-100 shadow-lg">
      <div className="grid grid-cols-4 h-16">
        {adminNavItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              id={`admin-nav-${label.toLowerCase()}`}
              className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span
                className={`flex items-center justify-center rounded-full w-10 h-6 transition-all duration-200 ${
                  isActive ? "bg-nacos-gold" : "bg-transparent"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              </span>
              <span className={`text-[10px] font-medium font-body ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
