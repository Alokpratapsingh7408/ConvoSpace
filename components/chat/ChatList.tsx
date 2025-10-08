"use client";

import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { mockChats } from "@/lib/mockData";
import Avatar from "../common/Avatar";
import { formatTime } from "@/lib/utils";
import { CheckCheck, BellOff, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatListProps {
  searchQuery?: string;
  onChatSelect?: (chatId: string) => void;
  isMobile?: boolean;
}

export default function ChatList({ 
  searchQuery = "", 
  onChatSelect,
  isMobile = false 
}: ChatListProps) {
  const router = useRouter();
  const { selectedChatId, selectChat } = useChatStore();

  const filteredChats = mockChats.filter((chat) => {
    const otherUser = chat.participants[1];
    return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleChatClick = (chatId: string) => {
    if (onChatSelect) {
      onChatSelect(chatId);
    } else {
      selectChat(chatId);
      router.push(`/chat/${chatId}`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {filteredChats.map((chat) => {
        const otherUser = chat.participants[1];
        const isSelected = selectedChatId === chat.id;
        const isMuted = otherUser.status === "offline"; // Example condition for muted state
        const hasImage = chat.lastMessage?.content?.toLowerCase().includes("image") || 
                        chat.lastMessage?.content?.toLowerCase().includes("photo");

        return (
          <button
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className={cn(
              "w-full py-3 px-4 transition-colors hover:bg-[#202c33]",
              isSelected && "bg-[#2a3942]"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <Avatar 
                src={otherUser.avatar} 
                alt={otherUser.name} 
                status={otherUser.status} 
                size="lg" 
              />

              {/* Chat Content */}
              <div className="min-w-0 flex-1">
                {/* Name and Time Row */}
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-base font-medium text-white">
                    {otherUser.name}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground text-gray-400">
                    {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ""}
                  </span>
                </div>

                {/* Preview Message Row */}
                <div className="mt-0.5 flex items-center gap-1.5 text-sm">
                  {/* Status Icon */}
                  {chat.lastMessage?.status === "read" && (
                    <CheckCheck className="size-4 text-[#53bdeb] shrink-0" />
                  )}
                  {(chat.lastMessage?.status === "delivered" || chat.lastMessage?.status === "sent") && (
                    <CheckCheck className="size-4 text-gray-400 shrink-0" />
                  )}

                  {/* Message Preview */}
                  <p className="truncate text-gray-400">
                    {chat.lastMessage?.content || "No messages yet"}
                  </p>

                  {/* Image Icon */}
                  {hasImage && (
                    <ImageIcon className="ml-1 size-4 shrink-0 text-gray-400/80" />
                  )}

                  {/* Muted Icon */}
                  {isMuted && (
                    <BellOff className="ml-1 size-4 shrink-0 text-gray-400/80" />
                  )}
                </div>

                {/* Unread Count Badge */}
                {chat.unreadCount > 0 && (
                  <div className="mt-1 flex justify-end">
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-black bg-[#00a884] rounded-full">
                      {chat.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
