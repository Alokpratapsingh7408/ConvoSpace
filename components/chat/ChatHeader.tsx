"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMoreVertical, FiSearch, FiPhone, FiVideo, FiArrowLeft } from "react-icons/fi";
import Avatar from "../common/Avatar";
import IconButton from "../common/IconButton";
import { User } from "@/types/chat";

interface ChatHeaderProps {
  user: User;
  onBack?: () => void;
}

export default function ChatHeader({ user, onBack }: ChatHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/chat");
    }
  };

  const handleVideoCall = () => {
    console.log("Video call feature coming soon!");
  };

  const handleVoiceCall = () => {
    console.log("Voice call feature coming soon!");
  };

  const handleSearch = () => {
    setShowSearch(!showSearch);
    // TODO: Implement search functionality
  };

  const handleMenu = () => {
    // TODO: Implement menu options
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#202c33] dark:bg-[#111b21] border-b border-gray-700">
      <div className="flex items-center gap-3">
        {/* Back button - Mobile only */}
        <button
          onClick={handleBack}
          className="md:hidden mr-2 text-gray-300 hover:text-white transition-colors"
        >
          <FiArrowLeft size={24} />
        </button>
        
        <Avatar src={user.avatar} alt={user.name} status={user.status} size="sm" />
        <div>
          <h2 className="font-medium text-white">{user.name}</h2>
          <p className="text-xs text-gray-400">
            {user.status === "online" ? "online" : `last seen recently`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <IconButton 
          icon={<FiVideo size={20} />} 
          variant="ghost" 
          className="text-gray-300 hover:bg-[#2a3942]"
          onClick={handleVideoCall}
        />
        <IconButton 
          icon={<FiPhone size={20} />} 
          variant="ghost" 
          className="text-gray-300 hover:bg-[#2a3942]"
          onClick={handleVoiceCall}
        />
        <IconButton 
          icon={<FiSearch size={20} />} 
          variant="ghost" 
          className="text-gray-300 hover:bg-[#2a3942]"
          onClick={handleSearch}
        />
       
      </div>
    </div>
  );
}
