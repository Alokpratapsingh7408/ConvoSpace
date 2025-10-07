"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "@/components/auth/PhoneInput";
import OTPInput from "@/components/auth/OTPInput";
import ProfileSetup from "@/components/auth/ProfileSetup";

type AuthStep = "phone" | "otp" | "profile";

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const router = useRouter();

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    
    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    
    // Log OTP to console for user to see
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔐 YOUR OTP CODE: " + otp);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Enter this code in the app to verify");
    
    setStep("otp");
  };

  const handleOTPVerify = (otp: string) => {
    if (otp === generatedOTP) {
      setStep("profile");
    } else {
      alert("Invalid OTP! Check console for the correct code.");
    }
  };

  const handleProfileComplete = () => {
    router.push("/chat");
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
    } else if (step === "profile") {
      setStep("otp");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === "phone" && (
          <PhoneInput onSubmit={handlePhoneSubmit} />
        )}
        
        {step === "otp" && (
          <OTPInput
            phoneNumber={phoneNumber}
            onVerify={handleOTPVerify}
            onBack={handleBack}
            onResend={handlePhoneSubmit}
          />
        )}
        
        {step === "profile" && (
          <ProfileSetup
            phoneNumber={phoneNumber}
            onComplete={handleProfileComplete}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
