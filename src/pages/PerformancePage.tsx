
import React, { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import PerformanceStats from "@/components/performance/PerformanceStats";
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

const PerformancePage: React.FC = () => {
  const [view, setView] = useState<"all" | "date">("all");
  const [date, setDate] = useState<Date>(new Date());
  
  return (
    <AppLayout requireRole="venue">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4">
          <h1 className="text-3xl font-bold">Performance Tracking</h1>
          
          <div className="flex space-x-2 w-full md:w-auto">
            {view === "date" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 md:flex-none">
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
            )}
          </div>
        </div>
        
        <Tabs 
          defaultValue="all" 
          value={view} 
          onValueChange={(v) => setView(v as "all" | "date")}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="date">By Date</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <PerformanceStats />
          </TabsContent>
          
          <TabsContent value="date">
            <PerformanceStats date={date} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default PerformancePage;
