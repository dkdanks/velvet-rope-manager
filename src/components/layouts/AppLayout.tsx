
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import NavBar from "./NavBar";

interface AppLayoutProps {
  children: React.ReactNode;
  requireRole?: "venue" | "promoter";
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, requireRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

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

  // Check if the current path is check-in and user is a promoter
  if (user.role === "promoter" && location.pathname.startsWith("/check-in")) {
    return <Navigate to="/dashboard" replace />;
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
