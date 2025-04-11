
import React from "react";
import AppLayout from "@/components/layouts/AppLayout";
import GuestListForm from "@/components/guest-list/GuestListForm";

const NewGuestListPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Guest List</h1>
        <GuestListForm />
      </div>
    </AppLayout>
  );
};

export default NewGuestListPage;
