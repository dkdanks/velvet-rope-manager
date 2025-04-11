
import React, { useState } from "react";
import { useGuestLists } from "@/context/GuestListContext";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layouts/AppLayout";
import GuestListCard from "@/components/guest-list/GuestListCard";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addDays, isToday, isSameDay } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { getGuestListsByDate } = useGuestLists();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const guestLists = getGuestListsByDate(selectedDate);
  
  const nextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };
  
  const previousDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };
  
  const today = () => {
    setSelectedDate(new Date());
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate("/guest-lists/new")}>
            <Plus className="mr-2 h-4 w-4" /> New Guest List
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Manage your guest lists</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex justify-between items-center mb-6">
              <Button variant="outline" size="icon" onClick={previousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  {format(selectedDate, "EEEE, MMMM d")}
                  {isToday(selectedDate) && " (Today)"}
                </h2>
              </div>
              <Button variant="outline" size="icon" onClick={nextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {!isToday(selectedDate) && (
              <div className="flex justify-center mb-6">
                <Button variant="ghost" onClick={today}>
                  Return to Today
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guestLists.length > 0 ? (
                guestLists.map((guestList) => (
                  <GuestListCard key={guestList.id} guestList={guestList} />
                ))
              ) : (
                <div className="text-center py-10 col-span-full">
                  <p className="text-muted-foreground mb-4">
                    No guest lists found for this date.
                  </p>
                  <Button onClick={() => navigate("/guest-lists/new")}>
                    <Plus className="mr-2 h-4 w-4" /> Create Guest List
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
