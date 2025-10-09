// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// Auth Types
export interface SendOTPRequest {
  phone_number: string;
  otp_type: 'login' | 'register';
}

export interface SendOTPResponse {
  phone_number: string;
  expires_at: string;
  user_exists: boolean;
  requires_registration: boolean;
}

export interface VerifyOTPRequest {
  phone_number: string;
  otp_code: string;
  full_name?: string;
  username?: string;
}

export interface User {
  id: number;
  phone_number: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VerifyOTPResponse {
  user: User;
  token: string;
  refresh_token: string;
}

// Error Response
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
