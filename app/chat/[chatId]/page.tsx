"use client";

import { use, useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ChatContainer from "@/components/chat/ChatContainer";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface ChatDetailPageProps {
  params: Promise<{ chatId: string }>;
}

export default function ChatDetailPage({ params }: ChatDetailPageProps) {
  const { chatId } = use(params);
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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