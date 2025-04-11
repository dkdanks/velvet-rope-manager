
import React, { useState } from "react";
import { useGuestLists } from "@/context/GuestListContext";
import { Guest, GenderType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CheckCircle, Calendar, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const GenderBadge: React.FC<{ gender?: GenderType }> = ({ gender }) => {
  if (!gender) return null;
  
  const classes = {
    male: "gender-tag gender-tag-male",
    female: "gender-tag gender-tag-female",
    neutral: "gender-tag gender-tag-neutral",
  };
  
  return (
    <span className={classes[gender]}>
      {gender.charAt(0).toUpperCase()}
    </span>
  );
};

interface CheckInSearchProps {
  selectedDate?: Date;
}

const CheckInSearch: React.FC<CheckInSearchProps> = ({ selectedDate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchGuests, guestLists, updateGuest } = useGuestLists();
  const { toast } = useToast();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const results = searchTerm.length > 1
    ? searchGuests(searchTerm, selectedDate)
    : [];
    
  const checkInGuest = (guest: Guest) => {
    const now = new Date();
    updateGuest(guest.id, guest.guestListId, {
      arrived: true,
      arrivedAt: now
    });
    
    toast({
      title: "Guest checked in",
      description: `${guest.name} has been checked in.`,
    });
  };
  
  const getGuestListById = (id: string) => {
    return guestLists.find(list => list.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for a guest by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 py-6 text-lg"
        />
      </div>
      
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((guest) => {
            const guestList = getGuestListById(guest.guestListId);
            return (
              <Card key={guest.id} className="overflow-hidden">
                <CardHeader className="bg-card py-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CardTitle className="text-base md:text-lg flex items-center">
                        {guest.name}
                        <GenderBadge gender={guest.gender} />
                      </CardTitle>
                    </div>
                    <Badge variant={guest.arrived ? "default" : "outline"}>
                      {guest.arrived ? "Arrived" : "Not Arrived"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="grid md:grid-cols-2 gap-2">
                    {guestList && (
                      <>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(guestList.eventDate), "EEE, MMM d")}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>List: {guestList.promoterName}</span>
                        </div>
                      </>
                    )}
                    {guest.arrived && guest.arrivedAt && (
                      <div className="flex items-center text-sm md:col-span-2">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Arrived at {format(new Date(guest.arrivedAt), "h:mm a")}</span>
                      </div>
                    )}
                  </div>
                  
                  {!guest.arrived && (
                    <Button
                      className="w-full mt-3"
                      onClick={() => checkInGuest(guest)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Check In
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : searchTerm.length > 1 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No guests found with that name.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CheckInSearch;
