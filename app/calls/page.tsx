"use client";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function CallsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex-1 flex items-center justify-center bg-[#0b141a]">
          <div className="text-center px-8">
            <h2 className="text-3xl font-light text-gray-400 mb-3">Calls</h2>
            <p className="text-gray-500">Voice and video calls feature coming soon!</p>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
