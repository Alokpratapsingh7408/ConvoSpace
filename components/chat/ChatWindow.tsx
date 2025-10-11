"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { useSocket } from "@/hooks/useSocket";
import MessageBubble from "./MessageBubble";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

interface ChatWindowProps {
  chatId: number;
  onBack?: () => void;
}

export default function ChatWindow({ chatId, onBack }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    chats, 
    fetchMessages, 
    loadMoreMessages,
    markAsRead, 
    isLoadingMessages,
    isLoadingMoreMessages,
    hasMoreMessages,
    isUserTyping,
  } = useChatStore();
  
  const { user: currentUser } = useAuthStore();
  const { isConnected, markAsRead: emitMarkAsRead } = useSocket();

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasLoadedMessages, setHasLoadedMessages] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);

  // Use useMemo to prevent unnecessary re-renders
  const chatMessages = useMemo(() => messages[chatId] || [], [messages, chatId]);
  const currentChat = useMemo(() => chats.find(c => c.id === chatId), [chats, chatId]);
  const otherUser = currentChat?.participants[0];
  const hasMore = hasMoreMessages[chatId] ?? false;

  // Check if user is typing
  const isTyping = otherUser ? isUserTyping(chatId, otherUser.id) : false;

  // Debug typing state - WITH MORE DETAILS
  useEffect(() => {
    console.log('⌨️ [TYPING DEBUG] ========================================');
    console.log('⌨️ [TYPING DEBUG] Chat ID:', chatId);
    console.log('⌨️ [TYPING DEBUG] Other User:', otherUser);
    console.log('⌨️ [TYPING DEBUG] Other User ID:', otherUser?.id, 'Type:', typeof otherUser?.id);
    console.log('⌨️ [TYPING DEBUG] isTyping:', isTyping);
    console.log('⌨️ [TYPING DEBUG] Store typingUsers:', useChatStore.getState().typingUsers);
    console.log('⌨️ [TYPING DEBUG] ========================================');
  }, [chatId, otherUser?.id, isTyping]);

  // Fetch messages when chat is opened (only when chatId changes)
  useEffect(() => {
    const loadMessages = async () => {
      setHasLoadedMessages(false);
      await fetchMessages(chatId);
      setHasLoadedMessages(true);
    };
    
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]); // Only re-fetch when chatId changes

  // Auto-scroll to bottom on new messages or when typing starts
  useEffect(() => {
    if (isAtBottom && hasLoadedMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAtBottom, hasLoadedMessages, isTyping]);

  // Initial scroll to bottom after messages load
  useEffect(() => {
    if (hasLoadedMessages && chatMessages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 100);
    }
  }, [hasLoadedMessages, chatMessages.length]);

  // Mark messages as read when viewing (only when there are actual unread messages)
  useEffect(() => {
    // Only run when we have loaded messages and user/other user are available
    if (!hasLoadedMessages || !currentUser || !otherUser || chatMessages.length === 0) {
      return;
    }

    const markChatAsRead = async () => {
      // Find unread messages from the other user - handle type mismatch
      const unreadMessages = chatMessages.filter(msg => {
        const senderIdMatch = msg.senderId == otherUser.id; // Use == for type coercion
        const notRead = msg.status !== 'read';
        return senderIdMatch && notRead;
      });

      // Only proceed if there are actually unread messages
      if (unreadMessages.length === 0) {
        return;
      }
      
      // Get the latest message to mark as read
      const latestMessage = unreadMessages[unreadMessages.length - 1];
      
      // Emit socket event for real-time update
      if (emitMarkAsRead && isConnected) {
        emitMarkAsRead(latestMessage.id, chatId);
      }
      
      // Also call REST API as backup
      await markAsRead(chatId);
    };

    markChatAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoadedMessages, chatMessages.length, chatId]); // Only run when messages are loaded or count changes

  // Handle scroll to detect if user is at bottom and at top for load more
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(atBottom);

    // Show load more button when scrolled near top (within 100px)
    const nearTop = scrollTop < 100;
    setShowLoadMore(nearTop && hasMore && !isLoadingMoreMessages);
  };

  // Load more messages handler
  const handleLoadMore = async () => {
    if (!hasMore || isLoadingMoreMessages) return;
    
    // Save current scroll height to maintain scroll position
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const previousScrollHeight = container.scrollHeight;
    
    await loadMoreMessages(chatId);
    
    // Restore scroll position after new messages are loaded
    setTimeout(() => {
      if (container) {
        const newScrollHeight = container.scrollHeight;
        const scrollHeightDifference = newScrollHeight - previousScrollHeight;
        container.scrollTop = scrollHeightDifference;
      }
    }, 100);
  };

  if (!currentChat || !otherUser) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0b141a]">
        <div className="text-center text-gray-400">
          <p className="text-xl mb-2">Chat not found</p>
          <p className="text-sm">Please select a chat from the list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#0b141a] relative">
      <ChatHeader user={otherUser} onBack={onBack} isTyping={isTyping} />

      {/* Messages Area with WhatsApp-style background */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-4 px-2 md:px-16 relative pb-24 md:pb-4"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 20, 26, 0.85), rgba(11, 20, 26, 0.85)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23202C33' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%2315202B'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: "#0b141a",
        }}
      >
        {/* Load More Button - Sticky at top */}
        {showLoadMore && chatMessages.length > 0 && (
          <div className="sticky top-2 z-10 flex justify-center mb-4 animate-fadeIn">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMoreMessages}
              className="bg-[#202c33] hover:bg-[#2a3942] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMoreMessages ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span className="text-sm">Load older messages</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Loading More Messages Indicator (alternative floating design) */}
        {isLoadingMoreMessages && !showLoadMore && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#202c33] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-10">
            <div className="w-4 h-4 border-2 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading older messages...</span>
          </div>
        )}
        {/* Loading State */}
        {isLoadingMessages && chatMessages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a884] mx-auto mb-4"></div>
              <p className="text-gray-400">Loading messages...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingMessages && chatMessages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-xl mb-2">No messages yet</p>
              <p className="text-sm">Send a message to start the conversation!</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {chatMessages.length > 0 && (
          <div className="max-w-full space-y-2">
            {chatMessages.map((message, index) => {
              const isOwnMessage = message.senderId === currentUser?.id;
              const showAvatar = !isOwnMessage && (
                index === chatMessages.length - 1 ||
                chatMessages[index + 1]?.senderId !== message.senderId
              );

              return (
                <MessageBubble
                  key={`message-${message.id}-${index}`}
                  message={message}
                  isOwnMessage={isOwnMessage}
                  showAvatar={showAvatar}
                  avatarUrl={showAvatar ? otherUser.avatar : undefined}
                />
              );
            })}
            
            {/* WhatsApp-Style Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start px-2 mb-1 gap-2 animate-fadeIn">
                {/* Avatar */}
                <div className="flex-shrink-0" style={{ width: '32px' }}>
                  {otherUser.avatar ? (
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#2a3942] flex items-center justify-center text-gray-400 text-sm font-medium">
                      {otherUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* WhatsApp-Style Typing Bubble - matches MessageBubble style */}
                <div className="max-w-[65%] md:max-w-[45%] bg-[#202c33] text-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
                  {/* Typing Dots */}
                  <div className="flex items-center gap-1 h-5">
                    <span className="typing-dot"></span>
                    <span className="typing-dot" style={{ animationDelay: '0.2s' }}></span>
                    <span className="typing-dot" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Connection Status Indicator */}
        {!isConnected && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            Connecting...
          </div>
        )}
      </div>

      <ChatInput chatId={chatId} receiverId={otherUser.id} />
    </div>
  );
}
