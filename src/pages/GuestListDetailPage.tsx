
import React from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layouts/AppLayout";
import GuestListDetail from "@/components/guest-list/GuestListDetail";

const GuestListDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return (
      <AppLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Guest List Not Found</h1>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Guest List Details</h1>
        <GuestListDetail guestListId={id} />
      </div>
    </AppLayout>
  );
};

export default GuestListDetailPage;
