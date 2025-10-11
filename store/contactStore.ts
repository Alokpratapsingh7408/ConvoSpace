import { create } from "zustand";
import { contactsApi, Contact } from "@/api/contacts";

interface ContactState {
  contacts: Contact[];
  blockedContacts: Contact[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setContacts: (contacts: Contact[]) => void;
  
  // API Actions
  fetchContacts: () => Promise<void>;
  addContact: (contactUserId: number, contactName?: string) => Promise<void>;
  updateContact: (contactId: number, contactName?: string, isFavorite?: boolean) => Promise<void>;
  deleteContact: (contactId: number) => Promise<void>;
  blockContact: (contactId: number, isBlocked: boolean) => Promise<void>;
  fetchBlockedContacts: () => Promise<void>;
  searchContacts: (query: string) => Promise<Contact[]>;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: [],
  blockedContacts: [],
  isLoading: false,
  error: null,

  setContacts: (contacts) => set({ contacts }),

  // Fetch all contacts
  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await contactsApi.getContacts();
      if (response.success) {
        set({ contacts: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch contacts',
        isLoading: false,
      });
    }
  },

  // Add a new contact
  addContact: async (contactUserId, contactName) => {
    set({ error: null });
    try {
      const response = await contactsApi.addContact({
        contact_user_id: contactUserId,
        contact_name: contactName,
      });
      if (response.success) {
        // Optimistically add the new contact
        set((state) => ({
          contacts: [...state.contacts, response.data],
        }));
        
        // Fetch updated contacts list to ensure we have complete data with nested user info
        // This is done in the background and won't block the UI
        get().fetchContacts();
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to add contact' });
      throw error;
    }
  },

  // Update contact
  updateContact: async (contactId, contactName, isFavorite) => {
    set({ error: null });
    try {
      const response = await contactsApi.updateContact(contactId, {
        contact_name: contactName,
        is_favorite: isFavorite,
      });
      if (response.success) {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.contact_id === contactId ? response.data : contact
          ),
        }));
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update contact' });
      throw error;
    }
  },

  // Delete contact
  deleteContact: async (contactId) => {
    set({ error: null });
    try {
      await contactsApi.deleteContact(contactId);
      set((state) => ({
        contacts: state.contacts.filter((contact) => contact.contact_id !== contactId),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete contact' });
      throw error;
    }
  },

  // Block/Unblock contact
  blockContact: async (contactId, isBlocked) => {
    set({ error: null });
    try {
      const response = await contactsApi.blockContact(contactId, isBlocked);
      if (response.success) {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.contact_id === contactId ? response.data : contact
          ),
        }));
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to block/unblock contact' });
      throw error;
    }
  },

  // Fetch blocked contacts
  fetchBlockedContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await contactsApi.getBlockedContacts();
      if (response.success) {
        set({ blockedContacts: response.data, isLoading: false });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch blocked contacts',
        isLoading: false,
      });
    }
  },

  // Search contacts
  searchContacts: async (query) => {
    try {
      const response = await contactsApi.searchContacts(query);
      if (response.success) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to search contacts' });
      return [];
    }
  },
}));
