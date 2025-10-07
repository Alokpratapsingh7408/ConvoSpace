"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export default function StoreInitializer() {
  const { setCurrentUser } = useUserStore();

  useEffect(() => {
    // Initialize mock current user
    setCurrentUser({
      id: "1",
      name: "You",
      email: "you@example.com",
      status: "online",
    });
  }, [setCurrentUser]);

  return null;
}
