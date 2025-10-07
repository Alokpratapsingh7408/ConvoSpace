"use client";

import AppLayout from "@/components/layout/AppLayout";

export default function ContactsPage() {
  return (
    <AppLayout>
      <div className="flex-1 flex items-center justify-center bg-[#0b141a]">
        <div className="text-center px-8">
          <h2 className="text-3xl font-light text-gray-400 mb-3">Contacts</h2>
          <p className="text-gray-500">Manage your contacts here.</p>
        </div>
      </div>
    </AppLayout>
  );
}
