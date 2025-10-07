"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export default function Home() {
  const router = useRouter();
  const { currentUser } = useUserStore();

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem("convoSpaceUser");
    
    if (currentUser || savedUser) {
      // User is logged in, go to chat
      router.push("/chat");
    } else {
      // Not logged in, go to auth
      router.push("/auth");
    }
  }, [router, currentUser]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b141a]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00a884] rounded-full mb-4 animate-pulse">
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-white">ConvoSpace</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    </main>
  );
}
