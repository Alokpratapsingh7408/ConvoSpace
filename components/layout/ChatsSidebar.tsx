"use client";

import { useState } from "react";
import { FiMoreVertical, FiEdit3 } from "react-icons/fi";
import SearchBar from "../common/SearchBar";
import ChatList from "../chat/ChatList";
import IconButton from "../common/IconButton";
import ThemeToggle from "../common/ThemeToggle";
import Avatar from "../common/Avatar";
import { useUserStore } from "@/store/userStore";

export default function ChatsSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = useUserStore((state) => state.currentUser);

  const handleNewChat = () => {
    alert("Start new chat coming soon!");
  };

  const handleMenu = () => {
    alert("Menu options coming soon!");
  };

  return (
    <div className="w-full md:w-80 lg:w-96 bg-[#111b21] dark:bg-[#0b141a] flex flex-col h-full md:h-screen border-r border-gray-700 pb-16 md:pb-0">
      {/* Profile Header - Desktop only */}
      <div className="hidden md:flex items-center justify-between px-4 py-3 bg-[#202c33] dark:bg-[#111b21]">
        <Avatar 
          src={currentUser?.avatar} 
          alt={currentUser?.name || "User"} 
          size="sm" 
        />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <IconButton 
            icon={<FiEdit3 size={20} />} 
            variant="ghost" 
            className="text-gray-300 hover:bg-[#2a3942]"
            onClick={handleNewChat}
          />
          <IconButton 
            icon={<FiMoreVertical size={20} />} 
            variant="ghost" 
            className="text-gray-300 hover:bg-[#2a3942]"
            onClick={handleMenu}
          />
        </div>
      </div>

      {/* Title Header - Mobile only */}
      <div className="md:hidden p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-white">Chats</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <IconButton 
              icon={<FiEdit3 size={20} />} 
              variant="ghost" 
              className="text-gray-300 hover:bg-[#2a3942]"
              onClick={handleNewChat}
            />
          </div>
        </div>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search or start new chat"
        />
      </div>

      {/* Search Bar - Desktop only */}
      <div className="hidden md:block p-4 border-b border-gray-700">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search or start new chat"
        />
      </div>

      {/* Chat List */}
      <ChatList searchQuery={searchQuery} />
    </div>
  );
}
