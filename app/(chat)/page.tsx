"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import AppLayout from "@/components/layout/AppLayout";
import ChatsSidebar from "@/components/layout/ChatsSidebar";

export default function ChatPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();

  useEffect(() => {
    // Check auth on mount
    const savedUser = localStorage.getItem("convoSpaceUser");
    if (!currentUser && !savedUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  return (
    <AppLayout>
      <ChatsSidebar />
      <div className="hidden md:flex flex-1 items-center justify-center bg-[#0b141a]">
        <div className="text-center px-8">
          <div className="w-80 h-80 mx-auto mb-8 relative">
            <svg viewBox="0 0 303 172" className="text-gray-600 opacity-50">
              <path
                fill="currentColor"
                d="M149.5 0C67.5 0 0 67.5 0 149.5S67.5 299 149.5 299 299 231.5 299 149.5 231.5 0 149.5 0zm0 268.5c-65.6 0-119-53.4-119-119s53.4-119 119-119 119 53.4 119 119-53.4 119-119 119z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-light text-gray-400 mb-3">ConvoSpace Web</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Send and receive messages without keeping your phone online.
          </p>
          <p className="text-xs text-gray-600">
            🔒 End-to-end encrypted
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
