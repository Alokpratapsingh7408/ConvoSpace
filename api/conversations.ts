import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';

export interface ConversationParticipant {
  user_id: number;
  full_name: string;
  username: string;
  avatar_url?: string;
  status?: string;
}

export interface LastMessage {
  message_id: number;
  message_text: string;
  sender_id: number;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  conversation_id: number;
  participant: ConversationParticipant;
  last_message?: LastMessage;
  unread_count: number;
  is_archived: boolean;
  is_muted: boolean;
  created_at: string;
  updated_at: string;
}

// Raw conversation object from backend (getOrCreateConversation)
export interface RawConversation {
  id: number;
  user_one_id: number;
  user_two_id: number;
  is_archived: boolean;
  is_muted: boolean;
  created_at: string;
  updated_at: string;
  userOne?: any;
  userTwo?: any;
}

export interface CreateConversationRequest {
  participant_id: number;
}

export interface ConversationDetailResponse {
  conversation_id: number;
  participants: ConversationParticipant[];
  is_archived: boolean;
  is_muted: boolean;
  created_at: string;
}

export const conversationsApi = {
  /**
   * Get all user conversations (chat list)
   */
  getConversations: async (): Promise<ApiResponse<Conversation[]>> => {
    return apiClient.get<ApiResponse<Conversation[]>>('/conversations');
  },

  /**
   * Create new conversation or get existing one
   */
  getOrCreateConversation: async (
    participantId: number
  ): Promise<ApiResponse<RawConversation>> => {
    return apiClient.post<ApiResponse<RawConversation>>('/conversations', {
      participant_id: participantId,
    });
  },

  /**
   * Get conversation details by ID
   */
  getConversationById: async (
    conversationId: number
  ): Promise<ApiResponse<ConversationDetailResponse>> => {
    return apiClient.get<ApiResponse<ConversationDetailResponse>>(
      `/conversations/${conversationId}`
    );
  },

  /**
   * Delete conversation
   */
  deleteConversation: async (conversationId: number): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(`/conversations/${conversationId}`);
  },

  /**
   * Archive conversation
   */
  archiveConversation: async (
    conversationId: number,
    isArchived: boolean
  ): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>(
      `/conversations/${conversationId}/archive`,
      { is_archived: isArchived }
    );
  },

  /**
   * Mute conversation
   */
  muteConversation: async (
    conversationId: number,
    isMuted: boolean
  ): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>(
      `/conversations/${conversationId}/mute`,
      { is_muted: isMuted }
    );
  },
};
