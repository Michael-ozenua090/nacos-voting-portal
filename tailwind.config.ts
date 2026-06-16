// Tailwind v4 uses CSS-based configuration via @theme in globals.css.
// This file is kept for compatibility with tooling that expects tailwind.config.ts.
// Brand tokens are defined in app/globals.css under the @theme directive.

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
