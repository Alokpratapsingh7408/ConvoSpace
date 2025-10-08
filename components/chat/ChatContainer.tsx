"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import { FiEdit3, FiSearch, FiArrowLeft } from "react-icons/fi";

interface ChatContainerProps {
  isMobile?: boolean;
}

export default function ChatContainer({ isMobile = false }: ChatContainerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedChatId, selectChat, clearSelectedChat } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // For mobile: Use ONLY state, NO routing
  const [mobileView, setMobileView] = useState<'list' | string>('list');
  
  // Extract chat ID from URL for desktop only
  const chatIdMatch = pathname?.match(/^\/chat\/(.+)$/);
  const urlChatId = chatIdMatch ? chatIdMatch[1] : null;

  // Desktop: Sync store with URL
  useEffect(() => {
    if (!isMobile) {
      if (urlChatId) {
        selectChat(urlChatId);
      } else {
        clearSelectedChat();
      }
    }
  }, [urlChatId, selectChat, clearSelectedChat, isMobile]);

  const handleChatSelect = (chatId: string) => {
    if (isMobile) {
      // Mobile: NO routing, just state change
      setMobileView(chatId);
      selectChat(chatId);
    } else {
      // Desktop: Use routing
      router.push(`/chat/${chatId}`);
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      // Mobile: NO routing, just state change
      setMobileView('list');
      clearSelectedChat();
    } else {
      // Desktop: Use routing
      router.push("/chat");
    }
  };

  const handleNewChat = () => {
    alert("Start new chat coming soon!");
  };

  // MOBILE: Pure state, NO routing
  if (isMobile) {
    const activeChatId = mobileView !== 'list' ? mobileView : null;
    
    return (
      <div className="w-full h-full bg-[#0b141a]">
        {/* Show List when mobileView is 'list' */}
        {!activeChatId && (
          <div className="w-full h-full flex flex-col">
            {/* Mobile Header */}
            <div className="bg-[#202c33] px-4 py-3 border-b border-gray-700/50 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-white text-xl font-medium">Chats</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="w-9 h-9 flex items-center justify-center text-gray-300 hover:bg-[#2a3942] rounded-full transition-colors active:scale-95"
                  >
                    <FiSearch size={20} />
                  </button>
                  <button
                    onClick={handleNewChat}
                    className="w-9 h-9 flex items-center justify-center text-gray-300 hover:bg-[#2a3942] rounded-full transition-colors active:scale-95"
                  >
                    <FiEdit3 size={20} />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              {isSearchOpen && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#2a3942] text-white placeholder-gray-400 px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#00a884] text-sm"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Mobile Chat List */}
            <div className="flex-1 overflow-hidden">
              <ChatList 
                searchQuery={searchQuery} 
                onChatSelect={handleChatSelect}
                isMobile={true}
              />
            </div>
          </div>
        )}

        {/* Show Chat Window when chat is selected */}
        {activeChatId && (
          <div className="w-full h-full">
            <ChatWindow chatId={activeChatId} onBack={handleBackToList} />
          </div>
        )}
      </div>
    );
  }

  // Desktop View Logic
  return (
    <div className="flex w-full h-full">
      {/* Desktop Sidebar */}
      <div className="w-80 lg:w-96 border-r border-gray-700 flex-shrink-0">
        <div className="h-full bg-[#111b21] flex flex-col">
          {/* Desktop Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#202c33] border-b border-gray-700">
            <h2 className="text-white text-lg font-medium">Chats</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-[#2a3942] rounded-full transition-colors"
              >
                <FiSearch size={18} />
              </button>
              <button
                onClick={handleNewChat}
                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:bg-[#2a3942] rounded-full transition-colors"
              >
                <FiEdit3 size={18} />
              </button>
            </div>
          </div>

          {/* Desktop Search Bar */}
          {isSearchOpen && (
            <div className="p-4 border-b border-gray-700">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2a3942] text-white placeholder-gray-400 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-[#00a884] text-sm"
                autoFocus
              />
            </div>
          )}

          {/* Desktop Chat List */}
          <div className="flex-1 overflow-hidden">
            <ChatList 
              searchQuery={searchQuery} 
              onChatSelect={handleChatSelect}
              isMobile={false}
            />
          </div>
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="flex-1">
        {urlChatId ? (
          <ChatWindow chatId={urlChatId} />
        ) : (
          // Default welcome screen
          <div className="flex items-center justify-center h-full bg-[#0b141a]">
            <div className="text-center px-8">
              <div className="w-80 h-80 mx-auto mb-8 relative">
                <svg viewBox="0 0 303 172" className="text-gray-600 opacity-50">
                  <path
                    fill="currentColor"
                    d="M149.5 0C67.5 0 0 67.5 0 149.5S67.5 299 149.5 299 299 231.5 299 149.5 231.5 0 149.5 0zm0 268.5c-65.6 0-119-53.4-119-119s53.4-119 119-119 119 53.4 119 119-53.4 119-119 119z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-light text-gray-400 mb-3">
                ConvoSpace Web
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Send and receive messages without keeping your phone online.
              </p>
              <p className="text-xs text-gray-600">🔒 End-to-end encrypted</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}