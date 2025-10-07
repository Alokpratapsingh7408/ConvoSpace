"use client";

import { useState } from "react";
import { FiArrowLeft, FiCamera } from "react-icons/fi";
import { useUserStore } from "@/store/userStore";

interface ProfileSetupProps {
  phoneNumber: string;
  onComplete: () => void;
  onBack: () => void;
}

export default function ProfileSetup({ phoneNumber, onComplete, onBack }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const { setCurrentUser } = useUserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    // Set user in store
    setCurrentUser({
      id: "1",
      name: name.trim(),
      email: `${phoneNumber.replace(/\D/g, "")}@convospace.com`,
      phone: phoneNumber,
      avatar: avatar || undefined,
      status: "online",
    });

    // Save to localStorage for persistence
    localStorage.setItem(
      "convoSpaceUser",
      JSON.stringify({
        id: "1",
        name: name.trim(),
        phone: phoneNumber,
        avatar: avatar || undefined,
      })
    );

    onComplete();
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
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-[#202c33] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a884] placeholder-gray-500"
            autoFocus
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-2">
            This is not your username. This name will be visible to your contacts.
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
          disabled={!name.trim()}
          className="w-full bg-[#00a884] text-white py-3 rounded-lg font-medium hover:bg-[#06cf9c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Done →
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
