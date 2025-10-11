"use client";

import { useEffect, useState } from 'react';
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useContactStore } from '@/store/contactStore';
import { conversationsApi, usersApi } from '@/api';
import { useChatStore } from '@/store/chatStore';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { FiMessageCircle, FiSearch, FiUser, FiUserPlus, FiX, FiCheck } from 'react-icons/fi';

interface UserSearchResult {
  id: number;
  phone_number: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  status?: string;
}

export default function ContactsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<UserSearchResult[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [addedUserIds, setAddedUserIds] = useState<Set<number>>(new Set());
  const [addingUserId, setAddingUserId] = useState<number | null>(null);
  
  const { 
    contacts, 
    isLoading, 
    error, 
    fetchContacts,
    addContact 
  } = useContactStore();
  const { fetchConversations } = useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Update added user IDs when contacts change
  useEffect(() => {
    const contactUserIds = new Set((contacts || []).map(c => c.contact_user_id));
    setAddedUserIds(contactUserIds);
  }, [contacts]);

  // Fetch all users when modal opens
  const handleOpenAddContactModal = async () => {
    setShowAddContactModal(true);
    setIsLoadingUsers(true);
    try {
      const response = await usersApi.getAllUsers();
      if (response.success && response.data?.users) {
        // Filter out current user and existing contacts
        const filteredUsers = response.data.users.filter(
          user => user.id !== currentUser?.id
        );
        setAllUsers(filteredUsers);
      } else {
        setAllUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setAllUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleAddContact = async (userId: number, userName: string) => {
    setAddingUserId(userId);
    try {
      await addContact(userId, userName);
      setAddedUserIds(prev => new Set([...prev, userId]));
      
      // Refresh contacts list to get complete data with nested user info
      await fetchContacts();
    } catch (error: any) {
      console.error('Failed to add contact:', error);
      alert(error.response?.data?.message || 'Failed to add contact. Please try again.');
    } finally {
      setAddingUserId(null);
    }
  };

  const handleStartChat = async (contactUserId: number) => {
    try {
      console.log('🔵 [Contact Click] Starting chat with user ID:', contactUserId);
      
      // Get or create conversation
      const response = await conversationsApi.getOrCreateConversation(contactUserId);
      console.log('🟢 [API Response] getOrCreateConversation:', response.data);
      
      if (response.success) {
        const conversationId = Number(response.data.id);
        console.log('🟡 [Conversation] ID:', conversationId);
        console.log('🟡 [Conversation] user_one_id:', response.data.user_one_id);
        console.log('🟡 [Conversation] user_two_id:', response.data.user_two_id);
        console.log('🟡 [Conversation] userOne:', response.data.userOne);
        console.log('🟡 [Conversation] userTwo:', response.data.userTwo);
        
        // Refresh conversations to get the latest list
        console.log('🔄 [Refreshing] Conversation list...');
        await fetchConversations();
        console.log('✅ [Refreshed] Conversation list updated');
        
        // Navigate to the conversation
        console.log('🚀 [Navigate] Going to /chat/' + conversationId);
        router.push(`/chat/${conversationId}`);
      }
    } catch (error) {
      console.error('❌ [Error] Failed to start chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  // Filter contacts based on search query
  const filteredContacts = (contacts || [])
    .filter((contact) => {
      // Filter out yourself (when user_id === contact_user_id)
      if (contact.user_id === contact.contact_user_id) {
        return false;
      }
      
      // Get the actual contact user data (backend returns 'contact' not 'contact_user')
      const contactUser = contact.contact || contact.contact_user;
      if (!contactUser) return false;
      
      const name = (contact.contact_name || contactUser.full_name || '').toLowerCase();
      const username = (contactUser.username || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query) || username.includes(query);
    });

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex-1 flex flex-col bg-[#0b141a] h-full">
          {/* Header */}
          <div className="bg-[#202c33] p-4 border-b border-[#2a3942]">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-white">Contacts</h1>
              
              {/* Add Contact Button */}
              <button
                onClick={handleOpenAddContactModal}
                className="flex items-center gap-2 px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#00997a] transition-colors"
              >
                <FiUserPlus className="w-5 h-5" />
                <span>Add Contact</span>
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2a3942] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a884] placeholder-gray-400"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a884] mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading contacts...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center px-4">
                  <div className="text-red-500 text-5xl mb-4">⚠️</div>
                  <p className="text-red-400 mb-2">Error loading contacts</p>
                  <p className="text-gray-500 text-sm">{error}</p>
                  <button
                    onClick={() => fetchContacts()}
                    className="mt-4 px-4 py-2 bg-[#00a884] text-white rounded-lg hover:bg-[#00997a] transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center px-4">
                  <FiUser className="text-6xl text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl text-gray-400 mb-2">
                    {searchQuery ? 'No contacts found' : 'No contacts yet'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {searchQuery 
                      ? 'Try a different search term' 
                      : 'Add some friends to start chatting!'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#2a3942]">
                {filteredContacts.map((contact, index) => {
                  // Get the actual contact user data (backend returns 'contact' not 'contact_user')
                  const contactUser = contact.contact || contact.contact_user;
                  if (!contactUser) return null;

                  console.log('👤 [Contact Render]', {
                    contact_id: contact.contact_id,
                    contact_user_id: contact.contact_user_id,
                    contact_name: contact.contact_name,
                    full_name: contactUser.full_name,
                    username: contactUser.username,
                  });

                  return (
                    <div
                      key={contact.contact_id || `contact-${index}`}
                      className="flex items-center gap-3 p-4 hover:bg-[#202c33] transition-colors"
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {contactUser.avatar_url ? (
                          <img
                            src={contactUser.avatar_url}
                            alt={contactUser.full_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#2a3942] flex items-center justify-center">
                            <FiUser className="text-gray-400 text-xl" />
                          </div>
                        )}
                        {contactUser.status === 'online' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0b141a]"></div>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {contact.contact_name || contactUser.full_name}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">
                          @{contactUser.username}
                        </p>
                        {contactUser.bio && (
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {contactUser.bio}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleStartChat(contact.contact_user_id)}
                          className="p-2 bg-[#00a884] text-white rounded-lg hover:bg-[#00997a] transition-colors group relative"
                          title="Send message"
                        >
                          <FiMessageCircle className="w-5 h-5" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Message
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="bg-[#202c33] p-3 border-t border-[#2a3942]">
            <p className="text-center text-sm text-gray-500">
              {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
            </p>
          </div>

          {/* Add Contact Modal - Functional */}
          {showAddContactModal && (
            <div 
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              onClick={() => setShowAddContactModal(false)}
            >
              <div 
                className="bg-[#202c33] rounded-lg max-w-2xl w-full mx-4 relative max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-[#2a3942]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">Add New Contact</h2>
                    <button
                      onClick={() => setShowAddContactModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or username..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#2a3942] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a884] placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto p-4">
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a884] mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading users...</p>
                      </div>
                    </div>
                  ) : allUsers.filter(user => {
                    const query = userSearchQuery.toLowerCase();
                    return (
                      user.full_name.toLowerCase().includes(query) ||
                      user.username.toLowerCase().includes(query)
                    );
                  }).length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center px-4">
                        <FiUser className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl text-gray-400 mb-2">
                          {userSearchQuery ? 'No users found' : 'No users available'}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {userSearchQuery 
                            ? 'Try a different search term' 
                            : 'All available users are already in your contacts'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {allUsers
                        .filter(user => {
                          const query = userSearchQuery.toLowerCase();
                          return (
                            user.full_name.toLowerCase().includes(query) ||
                            user.username.toLowerCase().includes(query)
                          );
                        })
                        .map((user, index) => {
                          const isAdded = addedUserIds.has(user.id);
                          const isAdding = addingUserId === user.id;

                          return (
                            <div
                              key={user.id || `user-${index}`}
                              className="flex items-center gap-3 p-3 hover:bg-[#2a3942] rounded-lg transition-colors"
                            >
                              {/* Avatar */}
                              <div className="relative flex-shrink-0">
                                {user.avatar_url ? (
                                  <img
                                    src={user.avatar_url}
                                    alt={user.full_name}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-[#00a884]/20 flex items-center justify-center">
                                    <FiUser className="text-[#00a884] text-xl" />
                                  </div>
                                )}
                                {user.status === 'online' && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#202c33]"></div>
                                )}
                              </div>

                              {/* User Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white truncate">
                                  {user.full_name}
                                </h3>
                                <p className="text-sm text-gray-400 truncate">
                                  @{user.username}
                                </p>
                                {user.bio && (
                                  <p className="text-xs text-gray-500 truncate mt-1">
                                    {user.bio}
                                  </p>
                                )}
                              </div>

                              {/* Add Button */}
                              <button
                                onClick={() => handleAddContact(user.id, user.full_name)}
                                disabled={isAdded || isAdding}
                                className={`p-3 rounded-lg transition-colors flex-shrink-0 ${
                                  isAdded
                                    ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                                    : isAdding
                                    ? 'bg-gray-500/20 text-gray-400 cursor-wait'
                                    : 'bg-[#00a884] text-white hover:bg-[#00997a]'
                                }`}
                                title={isAdded ? 'Already added' : isAdding ? 'Adding...' : 'Add contact'}
                              >
                                {isAdding ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                ) : isAdded ? (
                                  <FiCheck className="w-5 h-5" />
                                ) : (
                                  <FiUserPlus className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#2a3942] bg-[#202c33]">
                  <button
                    onClick={() => setShowAddContactModal(false)}
                    className="w-full py-3 bg-[#2a3942] text-white rounded-lg hover:bg-[#374954] transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
