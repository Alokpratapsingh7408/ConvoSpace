"use client";

import { useState } from "react";
import { FiArrowLeft, FiCamera } from "react-icons/fi";

interface ProfileSetupProps {
  phoneNumber: string;
  onComplete: (fullName: string, username: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function ProfileSetup({ phoneNumber, onComplete, onBack, isLoading = false }: ProfileSetupProps) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert("Please enter your full name");
      return;
    }

    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    // Validate username (alphanumeric and underscores only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      alert("Username can only contain letters, numbers, and underscores");
      return;
    }

    onComplete(fullName.trim(), username.trim());
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-[#111b21] rounded-lg p-8 shadow-xl">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#00a884] mb-6 hover:text-[#06cf9c] transition-colors"
      >
        <FiArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Profile Info
        </h1>
        <p className="text-gray-400 text-sm">
          Please provide your name and an optional profile photo
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex justify-center">
          <label className="cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <div className="relative">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#202c33]"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#202c33] flex flex-col items-center justify-center border-4 border-[#2a3942] group-hover:border-[#00a884] transition-colors">
                  <FiCamera size={32} className="text-gray-400 mb-2" />
                  <span className="text-xs text-gray-400">Add Photo</span>
                </div>
              )}
              {/* Camera Icon Overlay */}
              <div className="absolute bottom-0 right-0 bg-[#00a884] rounded-full p-2 border-4 border-[#111b21] group-hover:bg-[#06cf9c] transition-colors">
                <FiCamera size={16} className="text-white" />
              </div>
            </div>
          </label>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Full name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-[#202c33] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a884] placeholder-gray-500"
            autoFocus
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-2">
            This name will be visible to your contacts.
          </p>
        </div>

        {/* Username Input */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="Enter a username"
            className="w-full bg-[#202c33] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a884] placeholder-gray-500"
            maxLength={30}
          />
          <p className="text-xs text-gray-500 mt-2">
            Username can only contain letters, numbers, and underscores.
          </p>
        </div>

        {/* Phone Display */}
        <div className="bg-[#1f2c34] rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Verified Phone Number</p>
          <p className="text-white font-medium">{phoneNumber}</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!fullName.trim() || !username.trim() || isLoading}
          className="w-full bg-[#00a884] text-white py-3 rounded-lg font-medium hover:bg-[#06cf9c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Completing...
            </span>
          ) : (
            "Done →"
          )}
        </button>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          🔒 Your messages are end-to-end encrypted. No one outside of your chats,
          not even ConvoSpace, can read or listen to them.
        </p>
      </form>
    </div>
  );
}
