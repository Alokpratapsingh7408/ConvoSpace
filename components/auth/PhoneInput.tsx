"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
}

export default function PhoneInput({ onSubmit }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    const fullPhone = `${countryCode} ${phoneNumber}`;
    onSubmit(fullPhone);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, "");
    
    // Limit to 10 digits
    const limited = numbers.slice(0, 10);
    
    // Format as (XXX) XXX-XXXX
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else {
      return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <div className="bg-[#111b21] rounded-lg p-8 shadow-xl">
      {/* Logo/Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00a884] rounded-full mb-4">
          <svg
            className="w-12 h-12 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">
          Welcome to ConvoSpace
        </h1>
        <p className="text-gray-400 text-sm">
          Verify your phone number to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Country Selector */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Country
          </label>
          <div className="relative">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full bg-[#202c33] text-white px-4 py-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00a884] pr-10"
            >
              <option value="+1">🇺🇸 United States (+1)</option>
              <option value="+44">🇬🇧 United Kingdom (+44)</option>
              <option value="+91">🇮🇳 India (+91)</option>
              <option value="+86">🇨🇳 China (+86)</option>
              <option value="+81">🇯🇵 Japan (+81)</option>
              <option value="+49">🇩🇪 Germany (+49)</option>
              <option value="+33">🇫🇷 France (+33)</option>
              <option value="+61">🇦🇺 Australia (+61)</option>
              <option value="+55">🇧🇷 Brazil (+55)</option>
              <option value="+52">🇲🇽 Mexico (+52)</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Phone number
          </label>
          <div className="flex gap-3">
            <div className="bg-[#202c33] text-white px-4 py-3 rounded-lg flex items-center min-w-[70px] justify-center">
              {countryCode}
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="(555) 123-4567"
              className="flex-1 bg-[#202c33] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a884] placeholder-gray-500"
              autoFocus
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#00a884] text-white py-3 rounded-lg font-medium hover:bg-[#06cf9c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={phoneNumber.length < 10}
        >
          Next →
        </button>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          When you tap &quot;Next&quot;, ConvoSpace will send a verification code
          (displayed in console for demo purposes). Standard message rates may apply.
        </p>
      </form>
    </div>
  );
}
