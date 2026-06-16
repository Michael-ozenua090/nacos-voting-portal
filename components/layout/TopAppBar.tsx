"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/leaderboard", label: "Leaderboard" },
];

interface TopAppBarProps {
  isAdmin?: boolean;
}

export default function TopAppBar({ isAdmin = false }: TopAppBarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: hamburger (mobile) */}
        <button
          id="top-bar-menu"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="lg:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <Link
          href={isAdmin ? "/admin/dashboard" : "/"}
          id="top-bar-logo"
          className="font-heading font-bold text-nacos-green text-lg tracking-tight"
        >
          NACOS Awards
        </Link>

        {/* Desktop nav links */}
        {!isAdmin && (
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium font-body transition-colors ${
                    isActive
                      ? "text-nacos-green font-semibold"
                      : "text-gray-500 hover:text-nacos-green"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right: profile icon */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <div className="w-9 h-9 rounded-full bg-nacos-green flex items-center justify-center">
              <span className="text-white text-sm font-bold font-heading">A</span>
            </div>
          ) : (
            <Link
              href="/profile"
              id="top-bar-profile"
              className="w-9 h-9 rounded-full bg-nacos-green/10 flex items-center justify-center text-nacos-green hover:bg-nacos-green/20 transition-colors"
              aria-label="Profile"
            >
              <User size={18} />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && !isAdmin && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3 animate-slide-up">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium font-body text-gray-700 hover:text-nacos-green py-1 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
