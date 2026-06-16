import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-8 mt-16 mb-16 md:mb-0">
      <div className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-body text-center md:text-left">
            © 2024 NACOS. All Rights Reserved.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[
              { href: "/terms", label: "Terms" },
              { href: "/privacy", label: "Privacy" },
              { href: "/about", label: "About NACOS" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-gray-400 hover:text-nacos-green transition-colors font-body"
              >
                {label}
              </Link>
            ))}
            <span className="text-xs text-gray-400 font-body">
              Powered by{" "}
              <span className="text-nacos-green font-semibold">Flutterwave</span>
            </span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
