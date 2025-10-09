import { apiClient } from '@/lib/apiClient';
import {
  ApiResponse,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from '@/types/api';

export const authApi = {
  /**
   * Send OTP to phone number
   */
  sendOTP: async (data: SendOTPRequest): Promise<ApiResponse<SendOTPResponse>> => {
    return apiClient.post<ApiResponse<SendOTPResponse>>('/auth/send-otp', data);
  },

  /**
   * Verify OTP and complete authentication
   */
  verifyOTP: async (data: VerifyOTPRequest): Promise<ApiResponse<VerifyOTPResponse>> => {
    return apiClient.post<ApiResponse<VerifyOTPResponse>>('/auth/verify-otp', data);
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ token: string; refresh_token: string }>> => {
    return apiClient.post<ApiResponse<{ token: string; refresh_token: string }>>('/auth/refresh', {
      refresh_token: refreshToken,
    });
  },

  /**
   * Logout user
   */
  logout: async (): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>('/auth/logout');
  },
};
