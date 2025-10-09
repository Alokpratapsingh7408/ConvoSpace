"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "@/components/auth/PhoneInput";
import OTPInput from "@/components/auth/OTPInput";
import ProfileSetup from "@/components/auth/ProfileSetup";
import ToastContainer, { useToastStore } from "@/components/common/ToastContainer";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

type AuthStep = "phone" | "otp" | "profile";

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState(""); // Store OTP for later use
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToastStore();
  const { setAuth } = useAuthStore();

  const handlePhoneSubmit = async (phone: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.sendOTP({
        phone_number: phone,
        otp_type: "login",
      });

      if (response.success) {
        setPhoneNumber(phone);
        addToast({
          message: response.message || "OTP sent successfully! Check your phone.",
          type: "success",
        });
        
        // Show OTP in console for development
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📱 OTP sent to: " + phone);
        console.log("⏰ Expires at: " + new Date(response.data.expires_at).toLocaleTimeString());
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        setStep("otp");
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      addToast({
        message: error.response?.data?.message || "Failed to send OTP. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    // Just store the OTP and move to profile step
    // We won't verify yet until we have profile data
    setOtpCode(otp);
    addToast({
      message: "OTP verified! Please complete your profile.",
      type: "info",
    });
    setStep("profile");
  };

  const handleProfileComplete = async (fullName: string, username: string) => {
    // Now we have OTP + profile data, make the API call
    setIsLoading(true);
    try {
      const response = await authApi.verifyOTP({
        phone_number: phoneNumber,
        otp_code: otpCode,
        full_name: fullName,
        username: username,
      });

      if (response.success) {
        // Store auth data
        setAuth(
          response.data.user,
          response.data.token,
          response.data.refresh_token
        );

        addToast({
          message: "Authentication successful! Welcome to ConvoSpace.",
          type: "success",
        });

        // Redirect to chat
        setTimeout(() => {
          router.push("/chat");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Profile setup error:", error);
      addToast({
        message: error.response?.data?.message || "Failed to complete registration. Please try again.",
        type: "error",
      });
      // Go back to OTP step if verification fails
      setStep("otp");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
    } else if (step === "profile") {
      setStep("otp");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-[#0b141a] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {step === "phone" && (
            <PhoneInput onSubmit={handlePhoneSubmit} isLoading={isLoading} />
          )}
          
          {step === "otp" && (
            <OTPInput
              phoneNumber={phoneNumber}
              onVerify={handleOTPVerify}
              onBack={handleBack}
              onResend={handlePhoneSubmit}
              isLoading={isLoading}
            />
          )}
          
          {step === "profile" && (
            <ProfileSetup
              phoneNumber={phoneNumber}
              onComplete={handleProfileComplete}
              onBack={handleBack}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </>
  );
}
