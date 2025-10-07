"use client";

import { useState } from "react";
import { FiSend, FiPaperclip, FiSmile } from "react-icons/fi";
import { BsMic } from "react-icons/bs";
import { useChatStore } from "@/store/chatStore";
import { Message } from "@/types/chat";
import IconButton from "../common/IconButton";

interface ChatInputProps {
  chatId: string;
}

export default function ChatInput({ chatId }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { addMessage } = useChatStore();

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        chatId,
        senderId: "1", // Current user ID (mock)
        content: message,
        timestamp: new Date(),
        status: "sent",
      };

      addMessage(chatId, newMessage);
      setMessage("");
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
    <div className="p-3 bg-[#202c33] dark:bg-[#111b21] border-t border-gray-700">
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
