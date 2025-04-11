
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GuestListProvider } from "./context/GuestListContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import GuestListsPage from "./pages/GuestListsPage";
import NewGuestListPage from "./pages/NewGuestListPage";
import GuestListDetailPage from "./pages/GuestListDetailPage";
import CheckInPage from "./pages/CheckInPage";
import PerformancePage from "./pages/PerformancePage";
import PromotersPage from "./pages/PromotersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GuestListProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/guest-lists" element={<GuestListsPage />} />
              <Route path="/guest-lists/new" element={<NewGuestListPage />} />
              <Route path="/guest-lists/:id" element={<GuestListDetailPage />} />
              <Route path="/check-in" element={<CheckInPage />} />
              <Route path="/check-in/:id" element={<CheckInPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/promoters" element={<PromotersPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GuestListProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
