import { apiClient } from '@/lib/apiClient';
import { ApiResponse } from '@/types/api';

export interface ContactUser {
  user_id: number;
  full_name: string;
  username: string;
  phone_number: string;
  avatar_url?: string;
  bio?: string;
  status?: string;
  last_seen?: string;
}

export interface Contact {
  contact_id: number;
  user_id: number;
  contact_user_id: number;
  contact_name?: string;
  is_blocked: boolean;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  contact?: ContactUser;  // Backend returns 'contact' not 'contact_user'
  contact_user?: ContactUser;  // Keep for backward compatibility
}

export interface AddContactRequest {
  contact_user_id: number;
  contact_name?: string;
}

export interface UpdateContactRequest {
  contact_name?: string;
  is_favorite?: boolean;
}

export interface BlockContactRequest {
  is_blocked: boolean;
}

export interface SearchContactsParams {
  query: string;
}

export const contactsApi = {
  /**
   * Get all contacts
   */
  getContacts: async (): Promise<ApiResponse<Contact[]>> => {
    return apiClient.get<ApiResponse<Contact[]>>('/contacts');
  },

  /**
   * Add a new contact
   */
  addContact: async (data: AddContactRequest): Promise<ApiResponse<Contact>> => {
    return apiClient.post<ApiResponse<Contact>>('/contacts', data);
  },

  /**
   * Update contact details
   */
  updateContact: async (
    contactId: number,
    data: UpdateContactRequest
  ): Promise<ApiResponse<Contact>> => {
    return apiClient.put<ApiResponse<Contact>>(`/contacts/${contactId}`, data);
  },

  /**
   * Delete a contact
   */
  deleteContact: async (contactId: number): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(`/contacts/${contactId}`);
  },

  /**
   * Block/Unblock a contact
   */
  blockContact: async (
    contactId: number,
    isBlocked: boolean
  ): Promise<ApiResponse<Contact>> => {
    return apiClient.put<ApiResponse<Contact>>(`/contacts/${contactId}/block`, {
      is_blocked: isBlocked,
    });
  },

  /**
   * Get blocked contacts
   */
  getBlockedContacts: async (): Promise<ApiResponse<Contact[]>> => {
    return apiClient.get<ApiResponse<Contact[]>>('/contacts/blocked');
  },

  /**
   * Search contacts
   */
  searchContacts: async (query: string): Promise<ApiResponse<Contact[]>> => {
    return apiClient.get<ApiResponse<Contact[]>>(`/contacts/search?query=${encodeURIComponent(query)}`);
  },
};
