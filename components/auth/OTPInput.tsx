"use client";

import { useState, useRef, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";

interface OTPInputProps {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onBack: () => void;
  onResend: (phone: string) => void;
  isLoading?: boolean;
}

export default function OTPInput({ phoneNumber, onVerify, onBack, onResend, isLoading = false }: OTPInputProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      const otpString = newOtp.join("");
      setTimeout(() => onVerify(otpString), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = pastedData.split("").concat(Array(6 - pastedData.length).fill("")).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input or first empty
    const nextIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputRefs.current[nextIndex]?.focus();

    // Auto-verify if complete
    if (pastedData.length === 6) {
      setTimeout(() => onVerify(pastedData), 100);
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    inputRefs.current[0]?.focus();
    onResend(phoneNumber);
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
          Verifying your number
        </h1>
        <p className="text-gray-400 text-sm mb-4">
          Waiting to automatically detect an SMS sent to
        </p>
        <p className="text-[#00a884] font-medium">{phoneNumber}</p>
      </div>

      {/* OTP Alert */}
      <div className="bg-[#1f2c34] border border-[#00a884] rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-300 text-center">
          💡 <strong className="text-[#00a884]">Check your browser console</strong> for the OTP code
        </p>
        <p className="text-xs text-gray-500 text-center mt-1">
          Press F12 or Ctrl+Shift+I to open developer tools
        </p>
      </div>

      {/* OTP Input Boxes */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-3 text-center">
          Enter 6-digit code
        </label>
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 bg-[#202c33] text-white text-center text-xl font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a884] transition-all"
            />
          ))}
        </div>
      </div>

      {/* Resend Section */}
      <div className="text-center">
        {timer > 0 ? (
          <p className="text-sm text-gray-500">
            Resend code in <span className="text-[#00a884] font-medium">{timer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-sm text-[#00a884] hover:text-[#06cf9c] font-medium transition-colors"
          >
            Resend SMS
          </button>
        )}
      </div>

      {/* Manual Verify Button (if user wants to submit without auto-verify) */}
      <button
        onClick={() => onVerify(otp.join(""))}
        disabled={otp.some((digit) => digit === "") || isLoading}
        className="w-full mt-6 bg-[#00a884] text-white py-3 rounded-lg font-medium hover:bg-[#06cf9c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </span>
        ) : (
          "Verify"
        )}
      </button>

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Didn&apos;t receive the code? Check console or tap Resend SMS
      </p>
    </div>
  );
}
