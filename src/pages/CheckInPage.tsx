
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
import { useGuestLists } from "@/context/GuestListContext";
import GuestListCard from "@/components/guest-list/GuestListCard";

const CheckInPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [date, setDate] = useState<Date>(new Date());
  const { getGuestListsByDate } = useGuestLists();
  
  // Get guest lists for today
  const todaysGuestLists = getGuestListsByDate(date);
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Guest Check-In</h1>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto border-gray-200 rounded-lg">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-gray-200 shadow-sm rounded-lg">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className="rounded-lg"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {id ? (
          <GuestListDetail guestListId={id} />
        ) : (
          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 rounded-lg">
              <TabsTrigger 
                value="search"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
              >
                Search
              </TabsTrigger>
              <TabsTrigger 
                value="lists" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm"
              >
                Guest Lists
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="min-h-[300px]">
              <CheckInSearch selectedDate={date} />
            </TabsContent>
            
            <TabsContent value="lists" className="min-h-[300px]">
              {todaysGuestLists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {todaysGuestLists.slice(0, 10).map(guestList => (
                    <GuestListCard key={guestList.id} guestList={guestList} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                  <p className="text-gray-500 mb-4">
                    No guest lists found for this date.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

export default CheckInPage;
