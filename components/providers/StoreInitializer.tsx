"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export default function StoreInitializer() {
  const { setCurrentUser, currentUser, isHydrated } = useUserStore();

  useEffect(() => {
    // Only initialize mock user if no user exists after hydration
    if (isHydrated && !currentUser) {
      setCurrentUser({
        id: "1",
        name: "You",
        email: "you@example.com",
        status: "online",
      });
    }
  }, [setCurrentUser, currentUser, isHydrated]);

  return null;
}
