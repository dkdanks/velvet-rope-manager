
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import NavBar from "./NavBar";

interface AppLayoutProps {
  children: React.ReactNode;
  requireRole?: "venue" | "promoter";
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, requireRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="main-container flex items-center justify-center flex-1">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this area.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="main-container flex-1">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
