"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import AppLayout from "@/components/layout/AppLayout";
import ChatContainer from "@/components/chat/ChatContainer";
import { useIsMobile } from "@/hooks/useMediaQuery";

export default function ChatPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check auth on mount
    const savedUser = localStorage.getItem("convoSpaceUser");
    if (!currentUser && !savedUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  return (
    <AppLayout>
      <div className="w-full h-full">
        <ChatContainer isMobile={isMobile} />
      </div>
    </AppLayout>
  );
}