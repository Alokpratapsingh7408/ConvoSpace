"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { mockChats } from "@/lib/mockData";
import Avatar from "../common/Avatar";
import { formatTime } from "@/lib/utils";
import { FiCheck } from "react-icons/fi";
import { IoCheckmarkDone } from "react-icons/io5";

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

        return (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-800 ${
              isSelected
                ? "bg-[#2a3942]"
                : "hover:bg-[#202c33] active:bg-[#2a3942]"
            }`}
          >
            <Avatar src={otherUser.avatar} alt={otherUser.name} status={otherUser.status} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-white truncate">
                  {otherUser.name}
                </h3>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-400">
                    {formatTime(chat.lastMessage.timestamp)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  {chat.lastMessage?.status === "read" && (
                    <IoCheckmarkDone className="text-[#53bdeb] flex-shrink-0" size={16} />
                  )}
                  {chat.lastMessage?.status === "delivered" && (
                    <IoCheckmarkDone className="text-gray-400 flex-shrink-0" size={16} />
                  )}
                  {chat.lastMessage?.status === "sent" && (
                    <FiCheck className="text-gray-400 flex-shrink-0" size={16} />
                  )}
                  <p className="text-sm text-gray-400 truncate">
                    {chat.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-black bg-[#00a884] rounded-full ml-2">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
