
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-nightclub p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-primary">
          YourGuestList
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-foreground/80">
          The modern way to manage guest lists for nightclubs and events
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-secondary/40 p-6 rounded-lg backdrop-blur">
            <h2 className="text-xl font-bold mb-2 text-primary">For Venues</h2>
            <p className="text-foreground/70">
              Track all guest lists in one place and improve door operations with efficient check-ins
            </p>
          </div>
          <div className="bg-secondary/40 p-6 rounded-lg backdrop-blur">
            <h2 className="text-xl font-bold mb-2 text-primary">For Promoters</h2>
            <p className="text-foreground/70">
              Easily submit and manage guest lists for events and track performance metrics
            </p>
          </div>
          <div className="bg-secondary/40 p-6 rounded-lg backdrop-blur">
            <h2 className="text-xl font-bold mb-2 text-primary">For Everyone</h2>
            <p className="text-foreground/70">
              Streamlined operations, better guest experience, and valuable insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
