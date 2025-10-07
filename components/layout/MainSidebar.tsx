"use client";

import { usePathname, useRouter } from "next/navigation";
import { FiMessageCircle, FiUsers, FiUser } from "react-icons/fi";
import { IoCallOutline } from "react-icons/io5";
import Avatar from "../common/Avatar";
import { useUserStore } from "@/store/userStore";

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { id: "chats", icon: <FiMessageCircle size={24} />, label: "Chats", path: "/chat" },
  { id: "calls", icon: <IoCallOutline size={24} />, label: "Calls", path: "/calls" },
  { id: "contacts", icon: <FiUsers size={24} />, label: "Contacts", path: "/contacts" },
];

const mobileBottomNavItems: NavItem[] = [
  { id: "profile", icon: <FiUser size={24} />, label: "Profile", path: "/profile" },
];

export default function MainSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useUserStore();

  // Check if we're viewing a specific chat (hide mobile nav in chat view)
  // Match /chat/1, /chat/2, etc. but NOT /chat alone
  const isInChatView = pathname?.match(/^\/chat\/[^/]+$/);

  const isActive = (path: string) => {
    if (path === "/chat") {
      return pathname === "/chat";
    }
    return pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-16 lg:w-20 bg-[#202c33] dark:bg-[#111b21] border-r border-gray-700">
        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col items-center py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-lg transition-all ${
                isActive(item.path)
                  ? "bg-[#2a3942] text-[#00a884]"
                  : "text-gray-400 hover:bg-[#2a3942] hover:text-white"
              }`}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </nav>

        {/* Bottom Section: Profile Avatar */}
        <div className="border-t border-gray-700">
          {/* Profile Avatar */}
          <div className="flex items-center justify-center p-3 lg:p-4">
            <button
              onClick={() => router.push("/profile")}
              className="transition-opacity hover:opacity-80"
              title="Profile"
            >
              <Avatar
                src={currentUser?.avatar}
                alt={currentUser?.name || "User"}
                size="sm"
                status={currentUser?.status}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Hidden when viewing a specific chat */}
      {!isInChatView && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#202c33] dark:bg-[#111b21] border-t border-gray-700 z-50">
          <nav className="flex items-center justify-around h-16">
            {[...navItems, ...mobileBottomNavItems].map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors ${
                  isActive(item.path)
                    ? "text-[#00a884]"
                    : "text-gray-400 active:bg-[#2a3942]"
                }`}
              >
                {item.id === "profile" ? (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[#00a884]/10 flex items-center justify-center">
                      {currentUser?.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                          {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                ) : (
                  <>
                    {item.icon}
                    <span className="text-xs font-medium">{item.label}</span>
                  </>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
