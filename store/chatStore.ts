import { create } from "zustand";
import { Chat, Message } from "@/types/chat";

interface ChatState {
  chats: Chat[];
  messages: Record<string, Message[]>;
  selectedChatId: string | null;
  setChats: (chats: Chat[]) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;
  selectChat: (chatId: string) => void;
  clearSelectedChat: () => void;
  getMessagesByChatId: (chatId: string) => Message[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: {},
  selectedChatId: null,

  setChats: (chats) => set({ chats }),

  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages },
    })),

  addMessage: (chatId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
    })),

  selectChat: (chatId) => set({ selectedChatId: chatId }),

  clearSelectedChat: () => set({ selectedChatId: null }),

  getMessagesByChatId: (chatId) => get().messages[chatId] || [],
}));
