"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void, query: string) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribe(callback, query),
    () => window.matchMedia(query).matches,
    // Server-side always returns false (desktop view)
    () => false
  );
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
