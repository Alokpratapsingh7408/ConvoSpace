"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  // Initialize with undefined to detect hydration
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches ?? false;
}

export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

// Hook that returns true only after hydration to prevent flickering
export function useIsHydrated(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}