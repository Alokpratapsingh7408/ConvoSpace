"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import SearchBar from "../common/SearchBar";
import ChatList from "./ChatList";
import IconButton from "../common/IconButton";

export default function ChatSidebar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Chats</h1>
          <IconButton icon={<FiPlus />} variant="primary" />
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search chats..." />
      </div>
      <ChatList />
    </div>
  );
}
