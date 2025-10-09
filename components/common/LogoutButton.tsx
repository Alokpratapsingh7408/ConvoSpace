"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { authApi } from "@/api/auth";
import { useToastStore } from "./ToastContainer";

interface LogoutButtonProps {
  variant?: "text" | "button" | "icon";
  className?: string;
  showIcon?: boolean;
}

export default function LogoutButton({ 
  variant = "text", 
  className = "",
  showIcon = true 
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { clearAuth, user } = useAuthStore();
  const { setCurrentUser } = useUserStore();
  const { addToast } = useToastStore();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Call logout API if user is authenticated
      if (user) {
        try {
          await authApi.logout();
        } catch (error) {
          console.error("Logout API error:", error);
          // Continue with local logout even if API fails
        }
      }
      
      // Clear all authentication data
      localStorage.removeItem("convoSpaceUser");
      localStorage.removeItem("auth-storage");
      
      // Clear stores
      setCurrentUser(null);
      clearAuth();
      
      // Show success message
      addToast({
        message: "Logged out successfully!",
        type: "success",
      });
      
      // Redirect to auth page
      setTimeout(() => {
        router.push("/auth");
      }, 500);
    } catch (error) {
      console.error("Logout error:", error);
      
      // Force logout even on error
      localStorage.clear();
      setCurrentUser(null);
      clearAuth();
      
      addToast({
        message: "Logged out",
        type: "info",
      });
      
      router.push("/auth");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const baseClasses = "transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    text: "text-red-500 font-medium text-sm flex items-center gap-2 hover:text-red-600",
    button: "bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 flex items-center gap-2",
    icon: "text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-500/10"
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      title="Log out"
    >
      {isLoggingOut ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {variant !== "icon" && <span>Logging out...</span>}
        </>
      ) : (
        <>
          {showIcon && <FiLogOut size={16} />}
          {variant !== "icon" && <span>Log out</span>}
        </>
      )}
    </button>
  );
}
