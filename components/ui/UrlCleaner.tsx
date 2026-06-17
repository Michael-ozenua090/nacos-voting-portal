"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Detects payment redirect query params (e.g. ?status=completed&tx_ref=...)
 * and silently strips them from the URL bar for a clean, professional look.
 */
export default function UrlCleaner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("status") === "completed") {
      window.location.replace("/leaderboard");
    }
  }, [searchParams]);

  return null; // renders nothing — pure side-effect component
}
