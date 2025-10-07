"use client";

interface SuccessNotificationProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export function SuccessNotification({ isVisible, message, onClose }: SuccessNotificationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[80] animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#C6EEC4] border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
        {/* Checkmark Icon */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="flex-1">
          <p className="text-gray-800 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
