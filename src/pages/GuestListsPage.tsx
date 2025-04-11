
import React from "react";
import { useGuestLists } from "@/context/GuestListContext";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layouts/AppLayout";
import GuestListCard from "@/components/guest-list/GuestListCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GuestListsPage: React.FC = () => {
  const { user } = useAuth();
  const { guestLists, getGuestListsByPromoter } = useGuestLists();
  const navigate = useNavigate();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingGuestLists = guestLists.filter(
    list => new Date(list.eventDate) >= today
  );
  
  const pastGuestLists = guestLists.filter(
    list => new Date(list.eventDate) < today
  );
  
  const promoterGuestLists = user?.id 
    ? getGuestListsByPromoter(user.id) 
    : [];
    
  const displayGuestLists = user?.role === "venue" 
    ? guestLists 
    : promoterGuestLists;
    
  const upcomingLists = displayGuestLists.filter(
    list => new Date(list.eventDate) >= today
  );
  
  const pastLists = displayGuestLists.filter(
    list => new Date(list.eventDate) < today
  );
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Guest Lists</h1>
          <Button onClick={() => navigate("/guest-lists/new")}>
            <Plus className="mr-2 h-4 w-4" /> New Guest List
          </Button>
        </div>
        
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingLists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingLists.map((guestList) => (
                  <GuestListCard key={guestList.id} guestList={guestList} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">
                  No upcoming guest lists found.
                </p>
                <Button onClick={() => navigate("/guest-lists/new")}>
                  <Plus className="mr-2 h-4 w-4" /> Create Guest List
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {pastLists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastLists.map((guestList) => (
                  <GuestListCard key={guestList.id} guestList={guestList} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  No past guest lists found.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default GuestListsPage;
