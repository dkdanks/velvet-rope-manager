
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layouts/AppLayout";
import GuestListDetail from "@/components/guest-list/GuestListDetail";
import CheckInSearch from "@/components/check-in/CheckInSearch";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CheckInPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [date, setDate] = useState<Date>(new Date());
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Guest Check-In</h1>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Calendar className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {id ? (
          <GuestListDetail guestListId={id} />
        ) : (
          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="lists">Guest Lists</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search">
              <CheckInSearch selectedDate={date} />
            </TabsContent>
            
            <TabsContent value="lists">
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  Select a specific guest list from the dashboard to check in guests.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

export default CheckInPage;
