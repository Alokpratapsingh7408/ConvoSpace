import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useUserStore } from '@/store/userStore';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

interface TypingData {
  conversation_id: number;
  user_id: number;
}

interface MessageData {
  id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  message_type: string;
  media_url?: string;
  created_at: string;
  sender?: {
    id: number;
    username: string;
    full_name: string;
    profile_picture?: string;
  };
}

interface MessageStatusData {
  message_id: number;
  conversation_id?: number;
  read_by?: number;
  read_at?: string;
  delivered_at?: string;
}

interface PresenceData {
  user_id?: number;
  userId?: number;
  is_online?: boolean;
  last_seen_at?: string;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useAuthStore();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!token) {
      // Disconnect if no token
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;
    
    // Expose socket globally for debugging
    if (typeof window !== 'undefined') {
      (window as any).socket = socket;
    }
    
    // Log ALL socket events for debugging
    socket.onAny((eventName, ...args) => {
      console.log('🔊 [SOCKET EVENT]', eventName, args);
    });

    // Capture reconnect timeout for cleanup
    const currentReconnectTimeout = reconnectTimeoutRef;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      console.log('🎧 Registering socket event listeners...');
      setIsConnected(true);
      
      // Clear any pending reconnect timeout
      if (currentReconnectTimeout.current) {
        clearTimeout(currentReconnectTimeout.current);
      }
    });

    socket.on('disconnect', (reason: string) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
    });

    // Message events
    socket.on('message:receive', (data: any) => {
      console.log('� [SOCKET] ========================================');
      console.log('📬 [SOCKET] New message received');
      console.log('� [SOCKET] Message ID:', data.id);
      console.log('� [SOCKET] Conversation ID:', data.conversation_id);
      console.log('� [SOCKET] Sender ID:', data.sender_id);
      console.log('� [SOCKET] Message text:', data.message_text);
      
      try {
        const { addMessage, incrementUnreadCount, selectedChatId } = useChatStore.getState();
        
        console.log('📬 [SOCKET] Current selected chat ID:', selectedChatId);
        
        // Convert IDs to numbers if they're strings
        const conversationId = typeof data.conversation_id === 'string' 
          ? parseInt(data.conversation_id) 
          : data.conversation_id;
        
        const senderId = typeof data.sender_id === 'string'
          ? data.sender_id
          : String(data.sender_id);
        
        const messageId = typeof data.id === 'string'
          ? parseInt(data.id)
          : data.id;
        
        console.log('� [SOCKET] Adding message to conversation:', conversationId);
        
        addMessage(conversationId, {
          id: messageId,
          chatId: conversationId,
          content: data.message_text,
          senderId: senderId,
          timestamp: new Date(data.created_at),
          status: 'delivered',
          messageType: data.message_type as 'text' | 'image' | 'video' | 'audio' | 'file',
          mediaUrl: data.media_url,
        });
        
        console.log('✅ [SOCKET] Message added to store');
        
        // Increment unread count if not viewing this chat
        if (selectedChatId !== conversationId) {
          console.log('📬 [SOCKET] Chat not active - incrementing unread count');
          incrementUnreadCount(conversationId);
          console.log('✅ [SOCKET] Unread count incremented');
        } else {
          console.log('ℹ️ [SOCKET] Chat is active - not incrementing unread count');
        }
        
        console.log('📬 [SOCKET] ========================================');
      } catch (error) {
        console.error('❌ [SOCKET] Error adding message:', error);
        console.log('📬 [SOCKET] ========================================');
      }
    });

    socket.on('message:sent', (data: MessageData) => {
      console.log('✅ [SOCKET] Message sent confirmation:', data);
      // Replace optimistic message with real one from server
      const { messages, setMessages } = useChatStore.getState();
      const chatMessages = messages[data.conversation_id] || [];
      
      console.log('🔄 [SOCKET] Replacing optimistic message. Current messages:', chatMessages.length);
      
      // Find and replace the optimistic message (temporary ID)
      const updatedMessages = chatMessages.map(msg => {
        // If it's an optimistic message (same content, same sender, recent timestamp)
        if (
          msg.senderId === data.sender_id &&
          msg.content === data.message_text &&
          msg.id > Date.now() - 5000 // Within last 5 seconds
        ) {
          console.log('🔄 [SOCKET] Found optimistic message to replace:', msg.id, '→', data.id);
          return {
            ...msg,
            id: data.id, // Replace with real ID from server
            timestamp: new Date(data.created_at),
            status: 'sent' as const,
          };
        }
        return msg;
      });
      
      setMessages(data.conversation_id, updatedMessages);
      console.log('✅ [SOCKET] Message updated in store');
    });

    socket.on('message:delivered', async (data: MessageStatusData) => {
      console.log('✅ Message delivered:', data);
      const { updateMessageStatus } = useChatStore.getState();
      await updateMessageStatus(data.message_id, 'delivered');
    });

    socket.on('message:read', async (data: MessageStatusData) => {
      console.log('📨 [SOCKET] ========================================');
      console.log('📨 [SOCKET] Message:read event received');
      console.log('📨 [SOCKET] Data:', data);
      console.log('📨 [SOCKET] Message ID:', data.message_id);
      console.log('📨 [SOCKET] Conversation ID:', data.conversation_id);
      console.log('📨 [SOCKET] Read by:', data.read_by);
      console.log('📨 [SOCKET] ========================================');
      
      const { updateMessageStatus, decrementUnreadCount } = useChatStore.getState();
      
      // Update message status to 'read'
      console.log('🔄 [SOCKET] Updating message status to "read"...');
      await updateMessageStatus(data.message_id, 'read');
      console.log('✅ [SOCKET] Message status updated to "read"');
      
      // Decrement unread count in conversation list
      if (data.conversation_id) {
        console.log('🔄 [SOCKET] Decrementing unread count for conversation:', data.conversation_id);
        decrementUnreadCount(data.conversation_id);
        console.log('✅ [SOCKET] Decremented unread count for conversation:', data.conversation_id);
      } else {
        console.warn('⚠️ [SOCKET] No conversation_id in message:read event!');
      }
    });

    socket.on('message:error', (error: any) => {
      console.error('❌ Message error:', error);
    });

    // Typing events
    socket.on('typing:start', (data: TypingData) => {
      console.log('⌨️ [TYPING] User typing:', data);
      useChatStore.getState().setTypingUser(data.conversation_id, data.user_id, true);
    });

    socket.on('typing:stop', (data: TypingData) => {
      console.log('⌨️ [TYPING] User stopped typing:', data);
      useChatStore.getState().setTypingUser(data.conversation_id, data.user_id, false);
    });

    // Presence events
    socket.on('user:online', (data: PresenceData) => {
      const userId = data.user_id || data.userId;
      console.log('🟢 User online:', userId);
      if (userId) {
        const { updateUserStatus } = useUserStore.getState();
        updateUserStatus(userId, 'online');
      }
    });

    socket.on('user:offline', (data: PresenceData) => {
      const userId = data.user_id || data.userId;
      console.log('⚫ User offline:', userId);
      if (userId) {
        const { updateUserStatus } = useUserStore.getState();
        updateUserStatus(userId, 'offline', data.last_seen_at);
      }
    });

    socket.on('presence:update', (data: PresenceData) => {
      const userId = data.user_id || data.userId;
      console.log('🔄 Presence update:', userId, data.is_online);
      if (userId) {
        const { updateUserStatus } = useUserStore.getState();
        updateUserStatus(
          userId,
          data.is_online ? 'online' : 'offline',
          data.last_seen_at
        );
      }
    });

    // Cleanup
    return () => {
      console.log('🔌 Cleaning up socket connection');
      if (currentReconnectTimeout.current) {
        clearTimeout(currentReconnectTimeout.current);
      }
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('message:receive');
      socket.off('message:sent');
      socket.off('message:delivered');
      socket.off('message:read');
      socket.off('message:error');
      socket.off('typing:start');
      socket.off('typing:stop');
      socket.off('user:online');
      socket.off('user:offline');
      socket.off('presence:update');
      socket.disconnect();
    };
  }, [token]); // Only re-run when token changes!

  // Emit functions
  const sendMessage = (
    conversationId: number,
    receiverId: number,
    messageText: string,
    messageType: string = 'text',
    mediaUrl?: string
  ) => {
    if (!socketRef.current?.connected) {
      console.error('Socket not connected');
      return false;
    }

    socketRef.current.emit('message:send', {
      conversation_id: conversationId,
      receiver_id: receiverId,
      message_text: messageText,
      message_type: messageType,
      media_url: mediaUrl,
    });

    return true;
  };

  const markAsRead = (messageId: number, conversationId: number) => {
    if (!socketRef.current?.connected) {
      console.error('Socket not connected');
      return false;
    }

    socketRef.current.emit('message:read', {
      message_id: messageId,
      conversation_id: conversationId,
    });

    return true;
  };

  const startTyping = (conversationId: number, receiverId: number) => {
    if (!socketRef.current?.connected) {
      console.log('⌨️ [SOCKET] Cannot emit typing:start - not connected');
      return false;
    }

    console.log('⌨️ [SOCKET] Emitting typing:start:', { conversationId, receiverId });
    socketRef.current.emit('typing:start', {
      conversation_id: conversationId,
      receiver_id: receiverId,
    });

    return true;
  };

  const stopTyping = (conversationId: number, receiverId: number) => {
    if (!socketRef.current?.connected) {
      console.log('⌨️ [SOCKET] Cannot emit typing:stop - not connected');
      return false;
    }

    console.log('⌨️ [SOCKET] Emitting typing:stop:', { conversationId, receiverId });
    socketRef.current.emit('typing:stop', {
      conversation_id: conversationId,
      receiver_id: receiverId,
    });

    return true;
  };

  const updatePresence = (isOnline: boolean) => {
    if (!socketRef.current?.connected) return false;

    socketRef.current.emit('presence:update', {
      is_online: isOnline,
    });

    return true;
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
    updatePresence,
  };
}
