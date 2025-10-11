import { create } from "zustand";
import { Chat, Message } from "@/types/chat";
import { conversationsApi, messagesApi } from "@/api";
import { Conversation } from "@/api/conversations";
import { useAuthStore } from "./authStore";

interface ChatState {
  chats: Chat[];
  messages: Record<number, Message[]>;
  selectedChatId: number | null;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  isLoadingMoreMessages: boolean; // For pagination loading state
  hasMoreMessages: Record<number, boolean>; // Track if more messages available per chat
  messageOffset: Record<number, number>; // Track offset for pagination per chat
  error: string | null;
  typingUsers: Record<number, Set<number>>; // conversationId -> Set of userIds typing
  
  // Actions
  setChats: (chats: Chat[]) => void;
  setMessages: (chatId: number, messages: Message[]) => void;
  addMessage: (chatId: number, message: Message) => void;
  selectChat: (chatId: number) => void;
  clearSelectedChat: () => void;
  getMessagesByChatId: (chatId: number) => Message[];
  setTypingUser: (conversationId: number, userId: number, isTyping: boolean) => void;
  isUserTyping: (conversationId: number, userId: number) => boolean;
  incrementUnreadCount: (conversationId: number) => void;
  decrementUnreadCount: (conversationId: number) => void;
  
  // API Actions
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: number, limit?: number, offset?: number) => Promise<void>;
  loadMoreMessages: (conversationId: number, limit?: number) => Promise<void>; // New pagination action
  sendMessage: (conversationId: number, receiverId: number, messageText: string) => Promise<void>;
  markAsRead: (conversationId: number) => Promise<void>;
  deleteConversation: (conversationId: number) => Promise<void>;
  updateMessageStatus: (messageId: number, status: 'delivered' | 'read') => Promise<void>;
}

// Helper function to transform API conversation to Chat
const transformConversation = (conv: any, currentUserId: number): Chat => {
  console.log('🔷 [Transform] Converting conversation:', {
    conversationId: conv.id,
    user_one_id: conv.user_one_id,
    user_two_id: conv.user_two_id,
    currentUserId: currentUserId,
    'typeof user_one_id': typeof conv.user_one_id,
    'typeof currentUserId': typeof currentUserId,
  });

  // Determine the other participant (not the current user)
  // Convert both to numbers to ensure proper comparison
  const userOneId = Number(conv.user_one_id);
  const userTwoId = Number(conv.user_two_id);
  const isUserOne = userOneId === currentUserId;
  const otherUser = isUserOne ? conv.userTwo : conv.userOne;
  
  console.log('🔷 [Transform] Comparison details:', {
    userOneId,
    userTwoId,
    currentUserId,
    isUserOne,
    selectedUser: isUserOne ? 'userTwo' : 'userOne',
  });
  console.log('🔷 [Transform] Selected otherUser:', {
    id: otherUser?.id,
    full_name: otherUser?.full_name,
    username: otherUser?.username,
  });
  
  return {
    id: Number(conv.id),
    participants: [
      {
        id: Number(otherUser.id),
        name: otherUser.full_name,
        username: otherUser.username,
        avatar: otherUser.profile_picture,
        status: otherUser.is_online ? 'online' : 'offline',
      },
    ],
    lastMessage: conv.lastMessage
      ? {
          id: Number(conv.lastMessage.id),
          chatId: Number(conv.id),
          senderId: Number(conv.lastMessage.sender_id || conv.user_one_id),
          content: conv.lastMessage.message_text,
          timestamp: new Date(conv.lastMessage.created_at),
          status: 'delivered',
        }
      : undefined,
    unreadCount: conv.participants?.[0]?.unread_count || 0,
    type: 'direct',
    createdAt: new Date(conv.created_at),
    updatedAt: new Date(conv.updated_at),
    isArchived: conv.participants?.[0]?.is_archived || false,
    isMuted: conv.participants?.[0]?.is_muted || false,
  };
};

// Helper function to transform API message to Message
const transformMessage = (msg: any): Message => ({
  id: msg.message_id,
  chatId: msg.conversation_id,
  senderId: msg.sender_id,
  content: msg.message_text,
  timestamp: new Date(msg.created_at),
  status: msg.status?.[0]?.status || 'sent',
  messageType: msg.message_type,
  mediaUrl: msg.media_url,
  fileName: msg.file_name,
  fileSize: msg.file_size,
  isEdited: msg.is_edited,
  isDeleted: msg.is_deleted,
});

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: {},
  selectedChatId: null,
  isLoadingChats: false,
  isLoadingMessages: false,
  isLoadingMoreMessages: false,
  hasMoreMessages: {},
  messageOffset: {},
  error: null,
  typingUsers: {},

  setChats: (chats) => set({ chats }),

  setMessages: (chatId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [chatId]: messages },
    })),

  addMessage: (chatId, message) =>
    set((state) => {
      // Update last message in chat list and sort by most recent
      const updatedChats = state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, lastMessage: message, updatedAt: new Date() }
          : chat
      );
      
      // Sort chats: most recent message first (like WhatsApp)
      const sortedChats = updatedChats.sort((a, b) => {
        const timeA = a.lastMessage?.timestamp || a.updatedAt;
        const timeB = b.lastMessage?.timestamp || b.updatedAt;
        return new Date(timeB).getTime() - new Date(timeA).getTime();
      });

      console.log('💬 [CHATSTORE] Message added - sorting chat list');
      console.log('💬 [CHATSTORE] Chat', chatId, 'moved to top');
      
      return {
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), message],
        },
        chats: sortedChats,
      };
    }),

  selectChat: (chatId) => set({ selectedChatId: chatId }),

  clearSelectedChat: () => set({ selectedChatId: null }),

  getMessagesByChatId: (chatId) => get().messages[chatId] || [],

  setTypingUser: (conversationId, userId, isTyping) =>
    set((state) => {
      // Ensure userId is a number for consistency
      const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
      console.log('⌨️ [STORE] setTypingUser - Original:', userId, 'Converted:', numericUserId, 'Type:', typeof numericUserId);
      
      const typingUsers = { ...state.typingUsers };
      if (!typingUsers[conversationId]) {
        typingUsers[conversationId] = new Set();
      }
      if (isTyping) {
        typingUsers[conversationId].add(numericUserId);
        console.log('⌨️ [STORE] User', numericUserId, 'started typing in chat', conversationId);
      } else {
        typingUsers[conversationId].delete(numericUserId);
        console.log('⌨️ [STORE] User', numericUserId, 'stopped typing in chat', conversationId);
      }
      console.log('⌨️ [STORE] Current typing users for chat', conversationId, ':', Array.from(typingUsers[conversationId] || []));
      return { typingUsers };
    }),

  isUserTyping: (conversationId, userId) => {
    // Ensure userId is a number for consistency
    const numericUserId = typeof userId === 'string' ? parseInt(userId) : userId;
    const typingUsers = get().typingUsers[conversationId];
    const result = typingUsers ? typingUsers.has(numericUserId) : false;
    console.log('⌨️ [STORE] isUserTyping check - Chat:', conversationId, 'User:', numericUserId, 'Result:', result, 'Set:', Array.from(typingUsers || []));
    return result;
  },

  // Increment unread count for a conversation
  incrementUnreadCount: (conversationId) =>
    set((state) => {
      console.log('📊 [CHATSTORE] ========================================');
      console.log('📊 [CHATSTORE] INCREMENT unread count');
      console.log('📊 [CHATSTORE] Conversation ID:', conversationId);
      
      const updatedChats = state.chats.map((chat) => {
        if (chat.id === conversationId) {
          const newCount = (chat.unreadCount || 0) + 1;
          console.log('📊 [CHATSTORE] Found chat:', chat.name);
          console.log('📊 [CHATSTORE] Old count:', chat.unreadCount || 0);
          console.log('📊 [CHATSTORE] New count:', newCount);
          return { ...chat, unreadCount: newCount };
        }
        return chat;
      });
      
      console.log('📊 [CHATSTORE] ========================================');
      return { chats: updatedChats };
    }),

  // Decrement unread count for a conversation
  decrementUnreadCount: (conversationId) =>
    set((state) => {
      console.log('📉 [CHATSTORE] ========================================');
      console.log('📉 [CHATSTORE] DECREMENT unread count');
      console.log('📉 [CHATSTORE] Conversation ID:', conversationId);
      
      const updatedChats = state.chats.map((chat) => {
        if (chat.id === conversationId) {
          const newCount = Math.max(0, (chat.unreadCount || 0) - 1);
          console.log('📉 [CHATSTORE] Found chat:', chat.name);
          console.log('📉 [CHATSTORE] Old count:', chat.unreadCount || 0);
          console.log('📉 [CHATSTORE] New count:', newCount);
          return { ...chat, unreadCount: newCount };
        }
        return chat;
      });
      
      console.log('📉 [CHATSTORE] ========================================');
      return { chats: updatedChats };
    }),

  // Fetch all conversations
  fetchConversations: async () => {
    set({ isLoadingChats: true, error: null });
    try {
      const currentUserId = Number(useAuthStore.getState().user?.id);
      console.log('📋 [Fetch Conversations] Current user ID:', currentUserId, 'typeof:', typeof currentUserId);
      
      if (!currentUserId) {
        set({ error: 'User not authenticated', isLoadingChats: false });
        return;
      }

      const response = await conversationsApi.getConversations();
      console.log('📋 [Fetch Conversations] API Response:', response.data);
      
      if (response.success) {
        const chats = response.data.map((conv: any) => transformConversation(conv, currentUserId));
        
        // Sort chats by most recent message/update (like WhatsApp)
        const sortedChats = chats.sort((a, b) => {
          const timeA = a.lastMessage?.timestamp || a.updatedAt;
          const timeB = b.lastMessage?.timestamp || b.updatedAt;
          return new Date(timeB).getTime() - new Date(timeA).getTime();
        });
        
        console.log('📋 [Fetch Conversations] Transformed and sorted chats:', sortedChats.length);
        set({ chats: sortedChats, isLoadingChats: false });
      }
    } catch (error: any) {
      console.error('❌ [Fetch Conversations] Error:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch conversations',
        isLoadingChats: false 
      });
    }
  },

  // Fetch messages for a conversation
  fetchMessages: async (conversationId, limit = 50, offset = 0) => {
    set({ isLoadingMessages: true, error: null });
    try {
      const response = await messagesApi.getMessages(conversationId, { limit, offset });
      if (response.success) {
        // Backend returns messages in DESC order (newest first)
        // Reverse to get oldest first (correct chat order)
        const messages = response.data.map(transformMessage).reverse();
        
        // Initialize pagination state
        set({ 
          messages: { ...get().messages, [conversationId]: messages },
          messageOffset: { ...get().messageOffset, [conversationId]: messages.length },
          hasMoreMessages: { ...get().hasMoreMessages, [conversationId]: response.data.length === limit },
          isLoadingMessages: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch messages',
        isLoadingMessages: false 
      });
    }
  },

  // Load more (older) messages for pagination
  loadMoreMessages: async (conversationId, limit = 50) => {
    const currentOffset = get().messageOffset[conversationId] || 0;
    const hasMore = get().hasMoreMessages[conversationId];
    
    // Don't load if already loading or no more messages
    if (get().isLoadingMoreMessages || !hasMore) {
      console.log('📄 [PAGINATION] Skip loading - already loading or no more messages');
      return;
    }

    set({ isLoadingMoreMessages: true, error: null });
    console.log('📄 [PAGINATION] Loading more messages - offset:', currentOffset, 'limit:', limit);
    
    try {
      const response = await messagesApi.getMessages(conversationId, { 
        limit, 
        offset: currentOffset 
      });
      
      if (response.success) {
        // Backend returns messages in DESC order (newest first)
        // Reverse to get oldest first
        const newMessages = response.data.map(transformMessage).reverse();
        const existingMessages = get().messages[conversationId] || [];
        
        // Prepend old messages to the beginning
        const allMessages = [...newMessages, ...existingMessages];
        
        console.log('📄 [PAGINATION] Loaded', newMessages.length, 'more messages');
        console.log('📄 [PAGINATION] Total messages now:', allMessages.length);
        
        set({ 
          messages: { ...get().messages, [conversationId]: allMessages },
          messageOffset: { ...get().messageOffset, [conversationId]: currentOffset + newMessages.length },
          hasMoreMessages: { ...get().hasMoreMessages, [conversationId]: response.data.length === limit },
          isLoadingMoreMessages: false 
        });
      }
    } catch (error: any) {
      console.error('❌ [PAGINATION] Failed to load more messages:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to load more messages',
        isLoadingMoreMessages: false 
      });
    }
  },

  // Send a message
  sendMessage: async (conversationId, receiverId, messageText) => {
    try {
      const response = await messagesApi.sendMessage({
        conversation_id: conversationId,
        receiver_id: receiverId,
        message_text: messageText,
        message_type: 'text',
      });
      
      if (response.success) {
        const message = transformMessage(response.data);
        get().addMessage(conversationId, message);
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to send message' });
      throw error;
    }
  },

  // Mark conversation as read
  markAsRead: async (conversationId) => {
    try {
      console.log('📖 [CHATSTORE] ========================================');
      console.log('📖 [CHATSTORE] MARK AS READ (REST API)');
      console.log('📖 [CHATSTORE] Conversation ID:', conversationId);
      
      await messagesApi.markAllAsRead(conversationId);
      console.log('✅ [CHATSTORE] API call successful - marking conversation as read');
      
      // Update unread count in chats
      set((state) => {
        const updatedChats = state.chats.map((chat) => {
          if (chat.id === conversationId) {
            console.log('📖 [CHATSTORE] Found chat:', chat.name);
            console.log('📖 [CHATSTORE] Old unread count:', chat.unreadCount);
            console.log('📖 [CHATSTORE] New unread count: 0');
            return { ...chat, unreadCount: 0 };
          }
          return chat;
        });
        
        console.log('✅ [CHATSTORE] Unread count reset to 0');
        console.log('📖 [CHATSTORE] ========================================');
        return { chats: updatedChats };
      });
    } catch (error: any) {
      console.error('❌ [CHATSTORE] Failed to mark as read:', error);
      console.log('📖 [CHATSTORE] ========================================');
    }
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    try {
      await conversationsApi.deleteConversation(conversationId);
      set((state) => ({
        chats: state.chats.filter((chat) => chat.id !== conversationId),
        messages: Object.fromEntries(
          Object.entries(state.messages).filter(([id]) => Number(id) !== conversationId)
        ),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete conversation' });
      throw error;
    }
  },

  // Update message status
  updateMessageStatus: async (messageId, status) => {
    try {
      console.log('🔄 [CHATSTORE] ========================================');
      console.log('🔄 [CHATSTORE] UPDATE MESSAGE STATUS');
      console.log('🔄 [CHATSTORE] Message ID:', messageId);
      console.log('🔄 [CHATSTORE] New status:', status);
      
      await messagesApi.updateMessageStatus(messageId, status);
      console.log('✅ [CHATSTORE] API call successful');
      
      // Update message status in store
      set((state) => {
        const newMessages = { ...state.messages };
        let messageFound = false;
        let updatedChatId = null;
        
        Object.keys(newMessages).forEach((chatId) => {
          newMessages[Number(chatId)] = newMessages[Number(chatId)].map((msg) => {
            if (msg.id === messageId) {
              messageFound = true;
              updatedChatId = chatId;
              console.log('🔄 [CHATSTORE] Found message in chat:', chatId);
              console.log('🔄 [CHATSTORE] Old status:', msg.status);
              console.log('🔄 [CHATSTORE] New status:', status);
              return { ...msg, status };
            }
            return msg;
          });
        });
        
        if (!messageFound) {
          console.warn('⚠️ [CHATSTORE] Message not found in store! ID:', messageId);
        } else {
          console.log('✅ [CHATSTORE] Message status updated in store');
        }
        
        console.log('🔄 [CHATSTORE] ========================================');
        return { messages: newMessages };
      });
    } catch (error: any) {
      console.error('❌ [CHATSTORE] Failed to update message status:', error);
      console.log('🔄 [CHATSTORE] ========================================');
    }
  },
}));
