export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastSeen?: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  type: "direct" | "group";
  name?: string; // For group chats
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
