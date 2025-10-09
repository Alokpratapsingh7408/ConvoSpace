"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCamera, FiLogOut } from "react-icons/fi";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { SuccessNotification } from "@/components/common/SuccessNotification";

export default function MobileProfileView() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserStore();
  const { user: authUser, updateUser, clearAuth } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use authenticated user data if available, fallback to currentUser
  const displayUser = authUser || currentUser;
  
  // Helper to safely get user name
  const getUserName = (): string => {
    return authUser?.full_name || (currentUser as any)?.name || "";
  };

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("Hey there! I am using ConvoSpace.");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const [aboutError, setAboutError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize state from authenticated user
  useEffect(() => {
    if (authUser) {
      setFirstName(authUser.full_name || "");
      setUsername(authUser.username || "");
      setPhoto(authUser.avatar_url || null);
    } else if (currentUser) {
      setFirstName(currentUser.name || "");
      setPhoto(currentUser.avatar || null);
    }
  }, [authUser, currentUser]);

  const initialFirstName = authUser?.full_name || currentUser?.name || "";
  const initialUsername = authUser?.username || "";
  const initialAbout = "Hey there! I am using ConvoSpace.";
  const initialPhoto = authUser?.avatar_url || currentUser?.avatar || null;

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidName = (name: string) => {
    return !/^\d+$/.test(name.trim());
  };

  const hasValidChanges =
    firstName.trim() !== initialFirstName ||
    about.trim() !== initialAbout ||
    photo !== initialPhoto;

  const handleNameChange = (value: string) => {
    setFirstName(value);
    setNameError("");
  };

  const handleAboutChange = (value: string) => {
    setAbout(value);
    setAboutError("");
  };

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPhotoPreview(result);
      setPhoto(result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    try {
      // Show loading state
      setIsSaving(true);
      
      // Call logout API if user is authenticated
      if (authUser) {
        try {
          const { authApi } = await import("@/api/auth");
          await authApi.logout();
        } catch (error) {
          console.error("Logout API error:", error);
          // Continue with local logout even if API fails
        }
      }
      
      // Clear all local storage
      localStorage.removeItem("convoSpaceUser");
      localStorage.removeItem("auth-storage");
      
      // Clear both stores
      setCurrentUser(null);
      clearAuth();
      
      // Show success message
      setSuccessMessage("Logged out successfully!");
      setShowSuccess(true);
      
      // Redirect to auth page
      setTimeout(() => {
        router.push("/auth");
      }, 1500);
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even on error
      localStorage.clear();
      setCurrentUser(null);
      clearAuth();
      router.push("/auth");
    } finally {
      setIsSaving(false);
    }
  };

  const saveUserDetails = () => {
    if (!firstName.trim()) {
      setNameError("Name is required");
      return;
    }

    if (firstName.trim() && !isValidName(firstName.trim())) {
      setNameError("Invalid input");
      return;
    }

    if (about.trim().length > 139) {
      setAboutError("About must be less than 139 characters");
      return;
    }

    setIsSaving(true);

    // Update auth user if authenticated
    if (authUser) {
      updateUser({
        full_name: firstName.trim(),
        avatar_url: photo || undefined,
      });
    }

    // Also update old user store for backwards compatibility
    const updatedUser = {
      ...currentUser,
      id: currentUser?.id || authUser?.id?.toString() || "",
      name: firstName.trim(),
      avatar: photo || undefined,
    };

    setCurrentUser(updatedUser as any);
    localStorage.setItem("convoSpaceUser", JSON.stringify(updatedUser));

    setTimeout(() => {
      setIsSaving(false);
      setSuccessMessage("Profile updated successfully!");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 500);
  };

  return (
    <div className="w-full bg-[#0b141a] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-[#202c33] px-4 py-4 flex items-center justify-between border-b border-gray-700/50">
        <h2 className="text-white text-lg font-medium">Edit Profile</h2>
      </div>

      {/* Main Content - Centered on Desktop */}
      <div className="max-w-2xl mx-auto">
        {/* Avatar Section */}
        <div className="flex flex-col items-center py-6 px-4">
          <div className="relative mb-4">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden bg-[#00a884]/10 flex items-center justify-center">
              {photoPreview || photo ? (
                <img
                  src={photoPreview || photo || ""}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl md:text-4xl font-semibold">
                  {(firstName || getUserName())?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-white bg-transparent border-[#00a884]/50 hover:bg-[#00a884]/10 active:bg-[#00a884]/20 font-medium transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiCamera size={16} />
            <span className="text-sm">Update Photo</span>
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handlePhotoUpload(file);
              }
            }}
          />
        </div>

        {/* Form Section */}
        <div className="px-4 py-6 space-y-6">
          {/* Name Input */}
          <div className="relative">
            <label className="block text-xs text-[#8696a0] mb-2 ml-1">Full Name</label>
            <input
              className={`w-full bg-[#202c33] rounded-xl px-4 py-3 outline-none text-sm placeholder-[#8696a0] text-white border-2 transition-all ${
                nameError
                  ? "border-red-500 focus:border-red-500"
                  : "border-transparent focus:border-[#00a884]"
              }`}
              placeholder="Enter your full name"
              value={firstName}
              onChange={(e) => handleNameChange(e.target.value)}
              autoComplete="name"
            />
            {nameError && (
              <div className="mt-1 text-xs text-red-500">{nameError}</div>
            )}
          </div>

          {/* Username Display (Read-only for authenticated users) */}
          {authUser?.username && (
            <div className="relative">
              <label className="block text-xs text-[#8696a0] mb-2 ml-1">Username</label>
              <div className="w-full bg-[#1a2730] rounded-xl px-4 py-3 text-sm text-[#8696a0] border-2 border-transparent cursor-not-allowed">
                @{authUser.username}
              </div>
              <div className="mt-1 text-xs text-[#8696a0]">
                Username cannot be changed
              </div>
            </div>
          )}

        {/* About Input */}
        <div className="relative">
          <textarea
            className={`w-full bg-[#202c33] rounded-xl px-4 py-3 outline-none text-sm placeholder-[#8696a0] text-white border-2 transition-all resize-none ${
              aboutError
                ? "border-red-500 focus:border-red-500"
                : "border-transparent focus:border-[#00a884]"
            }`}
            placeholder="About"
            value={about}
            onChange={(e) => handleAboutChange(e.target.value)}
            rows={3}
            maxLength={139}
          />
          <div className="mt-1 flex items-center justify-between">
            {aboutError && (
              <div className="text-xs text-red-500">{aboutError}</div>
            )}
            <div className="ml-auto text-xs text-[#8696a0]">
              {about.length}/139
            </div>
          </div>
        </div>

        {/* Phone Display */}
        {(authUser?.phone_number || currentUser?.phone) && (
          <div className="relative">
            <label className="block text-xs text-[#8696a0] mb-2 ml-1">Phone Number</label>
            <div className="w-full bg-[#1a2730] rounded-xl px-4 py-3 text-sm text-[#8696a0] border-2 border-transparent cursor-not-allowed">
              {authUser?.phone_number || currentUser?.phone}
            </div>
            <div className="mt-1 text-xs text-[#8696a0]">
              Verified phone number
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-4 flex justify-center">
          <button
            className={`font-medium rounded-lg px-8 py-2.5 text-sm transition-all ${
              !hasValidChanges || isSaving
                ? "bg-[#2a3942] text-gray-500 cursor-not-allowed"
                : "bg-[#00a884] text-white active:bg-[#06cf9c] active:scale-[0.98]"
            }`}
            type="button"
            onClick={saveUserDetails}
            disabled={!hasValidChanges || isSaving}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>

        {/* Logout Button */}
        <div className="pt-6 flex justify-center">
          <button
            className="text-red-500 font-medium text-sm flex items-center gap-2 active:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogout}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging out...
              </>
            ) : (
              <>
                <FiLogOut size={16} />
                Log out
              </>
            )}
          </button>
        </div>
      </div>
      </div>

      {/* Success Notification */}
      <SuccessNotification
        isVisible={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
