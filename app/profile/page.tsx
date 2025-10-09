"use client";

import AppLayout from "@/components/layout/AppLayout";
import MobileProfileView from "@/components/profile/MobileProfileView";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex-1 flex flex-col bg-[#0b141a] overflow-auto">
          <MobileProfileView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
