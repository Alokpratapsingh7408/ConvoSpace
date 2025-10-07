"use client";

import { use } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ChatsSidebar from "@/components/layout/ChatsSidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatDetailPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = use(params);
  
  return (
    <AppLayout>
      <div className="hidden md:block">
        <ChatsSidebar />
      </div>
      <ChatWindow chatId={chatId} />
    </AppLayout>
  );
}
