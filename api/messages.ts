import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';

export interface MessageSender {
  user_id: number;
  full_name: string;
  username: string;
  avatar_url?: string;
}

export interface MessageStatusDetail {
  user_id: number;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

export interface Message {
  message_id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  message_text: string;
  message_type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'location';
  media_url?: string;
  file_name?: string;
  file_size?: number;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  sender?: MessageSender;
  status?: MessageStatusDetail[];
}

export interface SendMessageRequest {
  conversation_id: number;
  receiver_id: number;
  message_text: string;
  message_type?: 'text' | 'image' | 'file' | 'audio' | 'video' | 'location';
  media_url?: string;
  file_name?: string;
  file_size?: number;
}

export interface GetMessagesParams {
  limit?: number;
  offset?: number;
}

export interface UpdateMessageStatusRequest {
  status: 'delivered' | 'read';
}

export interface EditMessageRequest {
  message_text: string;
}

export const messagesApi = {
  /**
   * Send a message
   */
  sendMessage: async (data: SendMessageRequest): Promise<ApiResponse<Message>> => {
    return apiClient.post<ApiResponse<Message>>('/messages/send', data);
  },

  /**
   * Get messages for a conversation
   */
  getMessages: async (
    conversationId: number,
    params?: GetMessagesParams
  ): Promise<ApiResponse<Message[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString();
    return apiClient.get<ApiResponse<Message[]>>(
      `/messages/${conversationId}${query ? `?${query}` : ''}`
    );
  },

  /**
   * Update message status (delivered/read)
   */
  updateMessageStatus: async (
    messageId: number,
    status: 'delivered' | 'read'
  ): Promise<ApiResponse<null>> => {
    return apiClient.put<ApiResponse<null>>(`/messages/${messageId}/status`, {
      status,
    });
  },

  /**
   * Edit a message
   */
  editMessage: async (
    messageId: number,
    messageText: string
  ): Promise<ApiResponse<Message>> => {
    return apiClient.put<ApiResponse<Message>>(`/messages/${messageId}`, {
      message_text: messageText,
    });
  },

  /**
   * Delete a message
   */
  deleteMessage: async (messageId: number): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(`/messages/${messageId}`);
  },

  /**
   * Mark all messages in a conversation as read
   */
  markAllAsRead: async (conversationId: number): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>(
      `/messages/${conversationId}/mark-read`
    );
  },
};
