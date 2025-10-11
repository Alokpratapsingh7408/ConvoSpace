"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import Avatar from "../common/Avatar";
import { formatTime } from "@/lib/utils";
import { CheckCheck, BellOff, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatListProps {
  searchQuery?: string;
  onChatSelect?: (chatId: number) => void;
  isMobile?: boolean;
}

export default function ChatList({ 
  searchQuery = "", 
  onChatSelect,
  isMobile = false 
}: ChatListProps) {
  const { chats, selectedChatId, isLoadingChats, error, fetchConversations } = useChatStore();

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const otherUser = chat.participants[0];
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Note: chats are already sorted by most recent message in the store
  // No need to sort again here - just display in order

  const handleChatClick = (chatId: number) => {
    if (onChatSelect) {
      onChatSelect(chatId);
    }
  };

  // Loading state
  if (isLoadingChats) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a884] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading chats...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-400 mb-2">Error loading chats</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => fetchConversations()}
            className="px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#00997a] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredChats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl text-gray-400 mb-2">
            {searchQuery ? 'No chats found' : 'No chats yet'}
          </h3>
          <p className="text-gray-500 text-sm">
            {searchQuery 
              ? 'Try a different search term' 
              : 'Start a conversation from your contacts!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {filteredChats.map((chat) => {
        const otherUser = chat.participants[0];
        const isSelected = selectedChatId === chat.id;
        const hasImage = chat.lastMessage?.content?.toLowerCase().includes("image") || 
                        chat.lastMessage?.content?.toLowerCase().includes("photo");

        return (
          <button
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className={cn(
              "w-full py-3 px-4 transition-all duration-200 hover:bg-[#202c33]",
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
