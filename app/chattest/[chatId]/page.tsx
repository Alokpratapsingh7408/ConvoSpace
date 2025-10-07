"use client";

import { use } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ChatContainer from "@/components/chat/ChatContainer";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface ChatDetailPageProps {
  params: Promise<{ chatId: string }>;
}

export default function ChatDetailPage({ params }: ChatDetailPageProps) {
  const { chatId } = use(params);
  const isMobile = useIsMobile();
  
  return (
    <AppLayout>
      <div className="w-full h-full">
        <ChatContainer isMobile={isMobile} />
      </div>
    </AppLayout>
  );
}