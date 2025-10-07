"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiCamera, FiLogOut } from "react-icons/fi";
import { useUserStore } from "@/store/userStore";
import { SuccessNotification } from "@/components/common/SuccessNotification";

export default function MobileProfileView() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<string | null>(currentUser?.avatar || null);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const initialFirstName = currentUser?.name || "";
  const initialEmail = "";
  const initialPhoto = currentUser?.avatar || null;

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidName = (name: string) => {
    return !/^\d+$/.test(name.trim());
  };

  const hasValidChanges =
    firstName.trim() !== initialFirstName ||
    email.trim() !== initialEmail ||
    photo !== initialPhoto;

  const handleNameChange = (value: string) => {
    setFirstName(value);
    setNameError("");
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError("");
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

  const handleLogout = () => {
    localStorage.removeItem("convoSpaceUser");
    setCurrentUser(null);
    setSuccessMessage("Logged out successfully!");
    setShowSuccess(true);
    setTimeout(() => {
      router.push("/auth");
    }, 1500);
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

    if (email.trim() && !isValidEmail(email.trim())) {
      setEmailError("Invalid input");
      return;
    }

    setIsSaving(true);

    const updatedUser = {
      ...currentUser,
      id: currentUser?.id || "",
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

      {/* Avatar Section */}
      <div className="flex flex-col items-center py-6 px-4">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-[#00a884]/10 flex items-center justify-center">
            {photoPreview || photo ? (
              <img
                src={photoPreview || photo || ""}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold">
                {firstName.charAt(0).toUpperCase() || "U"}
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
          <input
            className={`w-full bg-[#202c33] rounded-xl px-4 py-3 outline-none text-sm placeholder-[#8696a0] text-white border-2 transition-all ${
              nameError
                ? "border-red-500 focus:border-red-500"
                : "border-transparent focus:border-[#00a884]"
            }`}
            placeholder="Full Name"
            value={firstName}
            onChange={(e) => handleNameChange(e.target.value)}
            autoComplete="name"
          />
          {nameError && (
            <div className="mt-1 text-xs text-red-500">{nameError}</div>
          )}
        </div>

        {/* Email Input */}
        <div className="relative">
          <input
            className={`w-full bg-[#202c33] rounded-xl px-4 py-3 outline-none text-sm placeholder-[#8696a0] text-white border-2 transition-all ${
              emailError
                ? "border-red-500 focus:border-red-500"
                : "border-transparent focus:border-[#00a884]"
            }`}
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            type="email"
            autoComplete="email"
          />
          {emailError && (
            <div className="mt-1 text-xs text-red-500">{emailError}</div>
          )}
        </div>

        {/* Phone Display */}
        {currentUser?.phone && (
          <div className="bg-[#202c33] rounded-xl px-4 py-3 border-2 border-transparent">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8696a0]">Phone</span>
              <span className="text-sm text-white font-medium">{currentUser.phone}</span>
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
            className="text-red-500 font-medium text-sm flex items-center gap-2 active:text-red-600 transition-colors"
            onClick={handleLogout}
          >
            <FiLogOut size={16} />
            Log out
          </button>
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
