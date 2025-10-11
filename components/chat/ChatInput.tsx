"use client";

import { useState, useEffect, useRef } from "react";
import { FiSend, FiPaperclip, FiSmile } from "react-icons/fi";
import { BsMic } from "react-icons/bs";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { useSocket } from "@/hooks/useSocket";
import IconButton from "../common/IconButton";

interface ChatInputProps {
  chatId: number;
  receiverId: number;
}

export default function ChatInput({ chatId, receiverId }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { sendMessage: sendMessageAPI } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const { sendMessage: sendMessageSocket, startTyping, stopTyping, isConnected } = useSocket();

  // Handle typing indicator - OPTIMIZED
  useEffect(() => {
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (message.length > 0) {
      // Start typing if not already typing
      if (!isTyping) {
        console.log('⌨️ [INPUT] Starting typing - Chat:', chatId, 'Receiver:', receiverId);
        setIsTyping(true);
        startTyping(chatId, receiverId);
      }

      // Set timeout to stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        console.log('⌨️ [INPUT] Stopping typing (timeout) - Chat:', chatId, 'Receiver:', receiverId);
        setIsTyping(false);
        stopTyping(chatId, receiverId);
      }, 3000);
    } else if (isTyping) {
      // Message is empty, stop typing immediately
      console.log('⌨️ [INPUT] Stopping typing (empty message) - Chat:', chatId, 'Receiver:', receiverId);
      setIsTyping(false);
      stopTyping(chatId, receiverId);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
    // Only depend on message changes, not isTyping
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  // Cleanup typing indicator on unmount
  useEffect(() => {
    return () => {
      if (isTyping) {
        stopTyping(chatId, receiverId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    if (message.trim() && currentUser) {
      const messageText = message.trim();
      setMessage("");

      // Stop typing indicator immediately
      if (isTyping) {
        setIsTyping(false);
        stopTyping(chatId, receiverId);
      }

      try {
        // Try Socket.IO first (real-time)
        if (isConnected) {
          // Add message optimistically to local state
          const optimisticMessage = {
            id: Date.now(), // Temporary ID
            chatId: chatId,
            senderId: currentUser.id,
            content: messageText,
            timestamp: new Date(),
            status: 'sent' as const,
            messageType: 'text' as const,
          };
          
          // Add to store immediately for instant feedback
          const { addMessage } = useChatStore.getState();
          addMessage(chatId, optimisticMessage);
          
          // Send via socket
          sendMessageSocket(chatId, receiverId, messageText);
        } else {
          // Fallback to REST API (will add message via response)
          await sendMessageAPI(chatId, receiverId, messageText);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        alert('Failed to send message. Please try again.');
        // Restore message on error
        setMessage(messageText);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmoji = () => {
    alert("Emoji picker coming soon!");
  };

  const handleAttachment = () => {
    alert("File attachment coming soon!");
  };

  const handleVoiceMessage = () => {
    alert("Voice message recording coming soon!");
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 p-3 bg-[#202c33] border-t border-gray-700 z-10 md:relative md:bottom-auto md:left-auto md:right-auto md:z-auto"
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-end gap-2">
        <IconButton
          icon={<FiSmile size={24} />}
          variant="ghost"
          className="text-gray-400 hover:text-gray-300 hover:bg-transparent pb-2"
          onClick={handleEmoji}
        />
        <IconButton
          icon={<FiPaperclip size={24} />}
          variant="ghost"
          className="text-gray-400 hover:text-gray-300 hover:bg-transparent pb-2"
          onClick={handleAttachment}
        />
        <div className="flex-1 bg-[#2a3942] rounded-lg">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            rows={1}
            className="w-full px-4 py-2.5 bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 resize-none max-h-32"
            style={{
              minHeight: "42px",
              maxHeight: "128px",
            }}
          />
        </div>
        {message.trim() ? (
          <IconButton
            icon={<FiSend size={20} />}
            onClick={handleSend}
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-transparent pb-2"
          />
        ) : (
          <IconButton
            icon={<BsMic size={24} />}
            variant="ghost"
            className="text-gray-400 hover:text-gray-300 hover:bg-transparent pb-2"
            onClick={handleVoiceMessage}
          />
        )}
      </div>
    </div>
  );
}
