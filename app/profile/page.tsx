"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit3, FiCamera, FiPhone, FiMail, FiLogOut } from "react-icons/fi";
import AppLayout from "@/components/layout/AppLayout";
import Avatar from "@/components/common/Avatar";
import { useUserStore } from "@/store/userStore";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserStore();

  const handleLogout = () => {
    localStorage.removeItem('convoSpaceUser');
    setCurrentUser(null);
    router.push('/auth');
  };

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col bg-[#0b141a] overflow-auto">
        {/* Header */}
        <div className="bg-[#202c33] border-b border-gray-700 p-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="md:hidden text-gray-400 hover:text-white p-2 -ml-2"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold text-white">Profile</h1>
        </div>

        {/* Profile Content */}
        <div className="flex-1 flex flex-col items-center py-8 px-4">
          {/* Avatar Section */}
          <div className="relative mb-8">
            <Avatar
              src={currentUser?.avatar}
              alt={currentUser?.name || "User"}
              size="xl"
              status={currentUser?.status}
            />
            <button
              className="absolute bottom-0 right-0 bg-[#00a884] text-white p-3 rounded-full shadow-lg hover:bg-[#06cf9c] transition-colors"
              title="Change photo"
            >
              <FiCamera size={20} />
            </button>
          </div>

          {/* User Details */}
          <div className="w-full max-w-md space-y-6">
            {/* Name Section */}
            <div className="bg-[#202c33] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">Name</label>
                <button className="text-[#00a884] hover:text-[#06cf9c]">
                  <FiEdit3 size={18} />
                </button>
              </div>
              <p className="text-white text-lg">{currentUser?.name || "Not set"}</p>
            </div>

            {/* Phone Section */}
            {currentUser?.phone && (
              <div className="bg-[#202c33] rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FiPhone className="text-gray-400" size={18} />
                  <label className="text-sm text-gray-400">Phone</label>
                </div>
                <p className="text-white text-lg ml-9">{currentUser.phone}</p>
              </div>
            )}

            {/* About Section */}
            <div className="bg-[#202c33] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">About</label>
                <button className="text-[#00a884] hover:text-[#06cf9c]">
                  <FiEdit3 size={18} />
                </button>
              </div>
              <p className="text-white">Hey there! I am using ConvoSpace.</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-colors mt-8"
            >
              <FiLogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
