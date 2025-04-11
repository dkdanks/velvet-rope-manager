
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle, Menu, CalendarDays, Users, BarChart } from "lucide-react";

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  return (
    <nav className="navbar p-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/dashboard" className="logo text-primary flex items-center">
            YourGuestList
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <Link
            to="/dashboard"
            className={`${
              location.pathname === "/dashboard"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            } transition-colors`}
          >
            Dashboard
          </Link>
          {user.role === "venue" && (
            <Link
              to="/promoters"
              className={`${
                location.pathname.startsWith("/promoters")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              } transition-colors`}
            >
              Promoters
            </Link>
          )}
          <Link
            to="/guest-lists"
            className={`${
              location.pathname.startsWith("/guest-lists")
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            } transition-colors`}
          >
            Guest Lists
          </Link>
          {user.role === "venue" && (
            <Link
              to="/check-in"
              className={`${
                location.pathname.startsWith("/check-in")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              } transition-colors`}
            >
              Check-in
            </Link>
          )}
          {user.role === "venue" && (
            <Link
              to="/performance"
              className={`${
                location.pathname.startsWith("/performance")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              } transition-colors`}
            >
              Performance
            </Link>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="w-full flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" /> Dashboard
                </Link>
              </DropdownMenuItem>
              {user.role === "venue" && (
                <DropdownMenuItem asChild>
                  <Link to="/promoters" className="w-full flex items-center">
                    <Users className="mr-2 h-4 w-4" /> Promoters
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/guest-lists" className="w-full flex items-center">
                  <Users className="mr-2 h-4 w-4" /> Guest Lists
                </Link>
              </DropdownMenuItem>
              {user.role === "venue" && (
                <DropdownMenuItem asChild>
                  <Link to="/check-in" className="w-full flex items-center">
                    <UserCircle className="mr-2 h-4 w-4" /> Check-in
                  </Link>
                </DropdownMenuItem>
              )}
              {user.role === "venue" && (
                <DropdownMenuItem asChild>
                  <Link to="/performance" className="w-full flex items-center">
                    <BarChart className="mr-2 h-4 w-4" /> Performance
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                <span className="hidden md:inline-block">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                {user.role === "venue" ? "Venue Staff" : "Promoter"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
