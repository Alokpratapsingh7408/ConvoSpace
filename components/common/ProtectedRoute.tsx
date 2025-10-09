"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { currentUser, isHydrated } = useUserStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for store to hydrate before checking auth
    if (!isHydrated) {
      return;
    }

    // Check if user is authenticated after hydration
    if (!currentUser) {
      router.push("/auth");
    } else {
      setIsChecking(false);
    }
  }, [currentUser, isHydrated, router]);

  // Show loading while checking authentication
  if (!isHydrated || isChecking) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0b141a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a884] mx-auto"></div>
          <p className="mt-4 text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return <>{children}</>;
}
