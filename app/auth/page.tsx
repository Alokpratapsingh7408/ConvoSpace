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
  const [requiresRegistration, setRequiresRegistration] = useState(false); // Track if user needs registration
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
        
        // Store whether user needs registration based on backend response
        setRequiresRegistration(response.data.requires_registration);
        
        addToast({
          message: response.message || "OTP sent successfully! Check your phone.",
          type: "success",
        });
        
        // Show OTP in console for development
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📱 OTP sent to: " + phone);
        console.log("👤 User exists: " + response.data.user_exists);
        console.log("📝 Requires registration: " + response.data.requires_registration);
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
    setOtpCode(otp);
    
    // Check if user needs registration (new user)
    if (requiresRegistration) {
      // New user - show profile setup
      addToast({
        message: "Please complete your profile to continue.",
        type: "info",
      });
      setStep("profile");
    } else {
      // Existing user - verify OTP and login directly
      setIsLoading(true);
      try {
        const response = await authApi.verifyOTP({
          phone_number: phoneNumber,
          otp_code: otp,
        });

        if (response.success) {
          // Store auth data
          setAuth(
            response.data.user,
            response.data.token,
            response.data.refresh_token
          );

          addToast({
            message: `Welcome back, ${response.data.user.full_name}!`,
            type: "success",
          });

          // Redirect to chat
          setTimeout(() => {
            router.push("/chat");
          }, 1000);
        }
      } catch (error: any) {
        console.error("OTP verification error:", error);
        addToast({
          message: error.response?.data?.message || error.response?.data?.error || "Invalid OTP. Please try again.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProfileComplete = async (fullName: string, username: string) => {
    // New user registration with OTP + profile data
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
          message: `Welcome to ConvoSpace, ${fullName}!`,
          type: "success",
        });

        // Redirect to chat
        setTimeout(() => {
          router.push("/chat");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Profile setup error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to complete registration.";
      
      // Check for specific errors
      if (errorMessage.includes("username") && errorMessage.includes("taken")) {
        addToast({
          message: "Username is already taken. Please choose another.",
          type: "error",
        });
      } else if (errorMessage.includes("expired") || errorMessage.includes("invalid OTP")) {
        addToast({
          message: "OTP has expired. Please request a new one.",
          type: "error",
        });
        setStep("phone");
        setOtpCode("");
      } else {
        addToast({
          message: errorMessage,
          type: "error",
        });
      }
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
