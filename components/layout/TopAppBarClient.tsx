"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, LayoutDashboard, Trophy, Users, Settings, CreditCard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/leaderboard", label: "Leaderboard" },
];

const adminNavLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Trophy },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/nominees", label: "Nominees", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface TopAppBarProps {
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

export default function TopAppBar({ isAdmin = false, isSuperAdmin = false }: TopAppBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAdminDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const adminLinks = isSuperAdmin
    ? [
        ...adminNavLinks.slice(0, 1),
        { href: "/admin/transactions", label: "Transactions", icon: CreditCard },
        ...adminNavLinks.slice(1)
      ]
    : adminNavLinks.filter((link) => link.href !== "/admin/settings");

  const activeNavLinks = isAdmin ? [...navLinks, ...adminLinks] : navLinks;

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
          className="flex items-center gap-2"
        >
          <Image src="/nacos-logo.jpg" alt="NACOS Logo" width={48} height={48} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <span className="font-heading font-bold text-nacos-green text-lg tracking-tight hidden sm:block">
            NACOS Awards
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-6">
          {activeNavLinks.map(({ href, label }) => {
            const isActive =
              href === "/" || href === "/admin/dashboard"
                ? pathname === href
                : pathname.startsWith(href);
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

        {/* Right: profile icon */}
        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
          {isAdmin && (
            <>
              <button
                onClick={() => setAdminDropdownOpen((o) => !o)}
                className="w-9 h-9 rounded-full bg-nacos-green flex items-center justify-center hover:bg-nacos-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nacos-green"
              >
                <span className="text-white text-sm font-bold font-heading">A</span>
              </button>
              
              {/* Admin Dropdown */}
              {adminDropdownOpen && (
                <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-slide-up origin-top-right">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-sm font-bold font-heading text-gray-900">Administrator</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm font-medium font-body text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3 animate-slide-up">
          {activeNavLinks.map(({ href, label }) => (
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
