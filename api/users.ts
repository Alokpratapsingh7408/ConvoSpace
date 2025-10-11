import { apiClient } from '@/lib/apiClient';
import { ApiResponse, User } from '@/types/api';

export interface UserSearchResult {
  id: number;
  phone_number: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  status?: string;
}

export interface GetAllUsersResponse {
  users: UserSearchResult[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const usersApi = {
  /**
   * Get all users (for searching/adding contacts)
   */
  getAllUsers: async (): Promise<ApiResponse<GetAllUsersResponse>> => {
    return apiClient.get<ApiResponse<GetAllUsersResponse>>('/users');
  },

  /**
   * Get user profile
   */
  getUserProfile: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<ApiResponse<User>>('/users/profile');
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (data: {
    full_name?: string;
    username?: string;
    bio?: string;
    avatar_url?: string;
  }): Promise<ApiResponse<User>> => {
    return apiClient.put<ApiResponse<User>>('/users/profile', data);
  },

  /**
   * Update online status
   */
  updateOnlineStatus: async (status: 'online' | 'offline' | 'away'): Promise<ApiResponse<null>> => {
    return apiClient.put<ApiResponse<null>>('/users/status', { status });
  },
};
