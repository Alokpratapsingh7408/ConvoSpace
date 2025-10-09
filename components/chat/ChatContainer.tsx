"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { useUIStore } from "@/store/uiStore";
import ChatWindow from "./ChatWindow";
import ChatList from "./ChatList";
import SearchBar from "../common/SearchBar";
import { FiEdit3, FiSearch, FiArrowLeft } from "react-icons/fi";
import { QrCode, Camera, UserRoundPlus, MoreVertical } from "lucide-react";

interface ChatContainerProps {
  isMobile?: boolean;
}

export default function ChatContainer({ isMobile = false }: ChatContainerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedChatId, selectChat, clearSelectedChat } = useChatStore();
  const { setMobileChatWindowOpen } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Extract chat ID from URL on initial load
  const chatIdMatch = pathname?.match(/^\/chat\/(.+)$/);
  const urlChatId = chatIdMatch ? chatIdMatch[1] : null;
  
  console.log('ChatContainer Debug:', { isMobile, pathname, urlChatId, selectedChatId });

  // Sync store with URL ONLY on initial mount (for deep linking)
  useEffect(() => {
    if (urlChatId && !selectedChatId) {
      selectChat(urlChatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount for deep linking

  // Mobile: Update UI store when chat window is open/closed
  useEffect(() => {
    if (isMobile) {
      const isWindowOpen = !!selectedChatId;
      setMobileChatWindowOpen(isWindowOpen);
    }
    
    // Cleanup when component unmounts
    return () => {
      if (isMobile) {
        setMobileChatWindowOpen(false);
      }
    };
  }, [isMobile, selectedChatId, setMobileChatWindowOpen]);

  const handleChatSelect = (chatId: string) => {
    // Both mobile and desktop: Use state, update URL WITHOUT navigation
    selectChat(chatId);
    // Update URL for deep linking support without triggering re-render
    window.history.replaceState(null, '', `/chat/${chatId}`);
  };

  const handleBackToList = () => {
    // Both mobile and desktop: Use state, update URL WITHOUT navigation
    clearSelectedChat();
    // Update URL for deep linking support without triggering re-render
    window.history.replaceState(null, '', '/chat');
  };

  const handleNewChat = () => {
    alert("Start new chat coming soon!");
  };

  // MOBILE VIEW: Use state-based rendering
  if (isMobile) {
    return (
      <div className="w-full h-full bg-[#0b141a]">
        {/* Show List when no chat is selected */}
        {!selectedChatId && (
          <div className="w-full h-full flex flex-col">
            {/* Mobile Header - TopBar Style */}
            <div className="px-4 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight text-white">ConvoSpace</h1>
                <div className="flex items-center gap-3">
                  {/* <IconButton ariaLabel="QR code" onClick={() => alert("QR code scanner coming soon!")}>
                    <QrCode className="size-5" />
                  </IconButton> */}
                  {/* <IconButton ariaLabel="Camera" onClick={() => alert("Camera coming soon!")}>
                    <Camera className="size-5" />
                  </IconButton> */}
                  <IconButton ariaLabel="New contact" onClick={() => alert("Add new contact coming soon!")}>
                    <UserRoundPlus className="size-5" />
                  </IconButton>
                  <IconButton ariaLabel="Menu" onClick={() => alert("Menu coming soon!")}>
                    <MoreVertical className="size-5" />
                  </IconButton>
                </div>
              </div>
            </div>

            {/* Search Bar Section */}
            <div className="px-4 pb-3 flex-shrink-0">
              <SearchBar 
                placeholder="Search or start new chat"
                value={searchQuery}
                onChange={setSearchQuery}
              />
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
        {selectedChatId && (
          <div className="w-full h-full">
            <ChatWindow chatId={selectedChatId} onBack={handleBackToList} />
          </div>
        )}
      </div>
    );
  }

  // DESKTOP VIEW: Use state-based rendering
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
        {selectedChatId ? (
          <ChatWindow chatId={selectedChatId} />
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

// IconButton Component
function IconButton({ 
  children, 
  ariaLabel, 
  onClick 
}: { 
  children: React.ReactNode; 
  ariaLabel: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center rounded-full text-gray-300 hover:bg-[#2a3942] hover:text-white transition-colors active:scale-95"
    >
      {children}
    </button>
  );
}