"use client";

import AppLayout from "@/components/layout/AppLayout";
import ChatContainer from "@/components/chat/ChatContainer";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useIsMobile } from "@/hooks/useMediaQuery";

export default function ChatPage() {
  const isMobile = useIsMobile();

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="w-full h-full">
          <ChatContainer isMobile={isMobile} />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}