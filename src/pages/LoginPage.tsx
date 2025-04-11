
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nightclub">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">YourGuestList</h1>
          <p className="text-muted-foreground">
            Manage your nightclub guest lists efficiently
          </p>
        </div>
        <LoginForm />
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Demo Logins:</p>
          <p>Venue: venue@yourguestlist.com</p>
          <p>Promoter: sam@promoter.com</p>
          <p className="mt-1">(Any password will work for demo)</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
