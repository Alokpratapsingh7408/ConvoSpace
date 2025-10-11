export interface User {
  id: number; // Changed from string to number to match backend
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastSeen?: Date;
  username?: string;
  bio?: string;
}

export interface Message {
  id: number; // Changed from string to number
  chatId: number; // Changed from string to number
  senderId: number; // Changed from string to number
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  messageType?: 'text' | 'image' | 'file' | 'audio' | 'video' | 'location';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface Chat {
  id: number; // Changed from string to number
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  type: "direct" | "group";
  name?: string; // For group chats
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isArchived?: boolean;
  isMuted?: boolean;
}

