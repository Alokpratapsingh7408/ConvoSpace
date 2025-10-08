"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import AppLayout from "@/components/layout/AppLayout";
import ChatContainer from "@/components/chat/ChatContainer";
import { useIsMobile } from "@/hooks/useMediaQuery";

export default function ChatPage() {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check auth on mount
    const savedUser = localStorage.getItem("convoSpaceUser");
    if (!currentUser && !savedUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <AppLayout>
        <div className="w-full h-full bg-[#0b141a]" />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full h-full">
        <ChatContainer isMobile={isMobile} />
      </div>
    </AppLayout>
  );
}