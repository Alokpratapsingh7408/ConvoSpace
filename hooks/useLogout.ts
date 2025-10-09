import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { authApi } from "@/api/auth";
import { useToastStore } from "@/components/common/ToastContainer";

export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { clearAuth, user } = useAuthStore();
  const { setCurrentUser } = useUserStore();
  const { addToast } = useToastStore();

  const logout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Call logout API if user is authenticated
      if (user) {
        try {
          await authApi.logout();
          console.log("Logged out from server");
        } catch (error) {
          console.error("Logout API error:", error);
          // Continue with local logout even if API fails
        }
      }
      
      // Clear all authentication data from localStorage
      localStorage.removeItem("convoSpaceUser");
      localStorage.removeItem("auth-storage");
      
      // Clear all stores
      setCurrentUser(null);
      clearAuth();
      
      // Show success message
      addToast({
        message: "Logged out successfully!",
        type: "success",
      });
      
      // Redirect to auth page after a short delay
      setTimeout(() => {
        router.push("/auth");
      }, 500);
      
      return true;
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
      return false;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
}
