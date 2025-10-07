import { User, Chat, Message } from "@/types/chat";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "You",
    email: "you@example.com",
    status: "online",
  },
  {
    id: "2",
    name: "Aalok Shah",
    email: "aalok@example.com",
    status: "online",
  },
  {
    id: "3",
    name: "Link Doe",
    email: "link@example.com",
    status: "online",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    status: "offline",
  },
  {
    id: "5",
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "online",
  },
];

export const mockChats: Chat[] = [
  {
    id: "2",
    participants: [mockUsers[0], mockUsers[1]],
    type: "direct",
    unreadCount: 2,
    createdAt: new Date("2025-10-01"),
    updatedAt: new Date(),
    lastMessage: {
      id: "msg-1",
      chatId: "2",
      senderId: "2",
      content: "Hey! How are you doing?",
      timestamp: new Date(),
      status: "read",
    },
  },
  {
    id: "3",
    participants: [mockUsers[0], mockUsers[2]],
    type: "direct",
    unreadCount: 0,
    createdAt: new Date("2025-10-02"),
    updatedAt: new Date(),
    lastMessage: {
      id: "msg-10",
      chatId: "3",
      senderId: "1",
      content: "See you tomorrow!",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: "delivered",
    },
  },
  {
    id: "4",
    participants: [mockUsers[0], mockUsers[3]],
    type: "direct",
    unreadCount: 5,
    createdAt: new Date("2025-10-03"),
    updatedAt: new Date(),
    lastMessage: {
      id: "msg-20",
      chatId: "4",
      senderId: "4",
      content: "Don't forget about the meeting!",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      status: "read",
    },
  },
  {
    id: "5",
    participants: [mockUsers[0], mockUsers[4]],
    type: "direct",
    unreadCount: 0,
    createdAt: new Date("2025-10-04"),
    updatedAt: new Date(),
    lastMessage: {
      id: "msg-30",
      chatId: "5",
      senderId: "1",
      content: "Thanks for your help!",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      status: "read",
    },
  },
];

export const mockMessages: Record<string, Message[]> = {
  "2": [
    {
      id: "msg-1",
      chatId: "2",
      senderId: "1",
      content: "Hello! How can I help you today?",
      timestamp: new Date("2025-10-06T10:00:00"),
      status: "read",
    },
    {
      id: "msg-2",
      chatId: "2",
      senderId: "2",
      content: "Hey! How are you doing?",
      timestamp: new Date("2025-10-06T10:05:00"),
      status: "read",
    },
    {
      id: "msg-3",
      chatId: "2",
      senderId: "1",
      content: "I'm doing great, thanks for asking!",
      timestamp: new Date("2025-10-06T10:10:00"),
      status: "delivered",
    },
  ],
  "3": [
    {
      id: "msg-10",
      chatId: "3",
      senderId: "3",
      content: "Are we still meeting tomorrow?",
      timestamp: new Date("2025-10-06T08:00:00"),
      status: "read",
    },
    {
      id: "msg-11",
      chatId: "3",
      senderId: "1",
      content: "See you tomorrow!",
      timestamp: new Date("2025-10-06T08:05:00"),
      status: "delivered",
    },
  ],
  "4": [
    {
      id: "msg-20",
      chatId: "4",
      senderId: "4",
      content: "Don't forget about the meeting!",
      timestamp: new Date("2025-10-06T06:00:00"),
      status: "read",
    },
    {
      id: "msg-21",
      chatId: "4",
      senderId: "4",
      content: "It's at 3 PM today",
      timestamp: new Date("2025-10-06T06:01:00"),
      status: "read",
    },
  ],
  "5": [
    {
      id: "msg-30",
      chatId: "5",
      senderId: "5",
      content: "Can you help me with something?",
      timestamp: new Date("2025-10-05T14:00:00"),
      status: "read",
    },
    {
      id: "msg-31",
      chatId: "5",
      senderId: "1",
      content: "Thanks for your help!",
      timestamp: new Date("2025-10-05T14:30:00"),
      status: "read",
    },
  ],
};
