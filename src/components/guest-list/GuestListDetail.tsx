
import React, { useState } from "react";
import { useGuestLists } from "@/context/GuestListContext";
import { GuestList, Guest, GenderType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Search, ArrowDownUp, Calendar, User as UserIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GuestListDetailProps {
  guestListId: string;
}

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

const GuestListDetail: React.FC<GuestListDetailProps> = ({ guestListId }) => {
  const { getGuestListById, updateGuest } = useGuestLists();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "arrived">("name");
  const guestList = getGuestListById(guestListId);
  
  if (!guestList) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Guest List Not Found</h2>
      </div>
    );
  }
  
  const toggleGuestArrival = (guest: Guest) => {
    const now = new Date();
    updateGuest(guest.id, guestListId, {
      arrived: !guest.arrived,
      arrivedAt: !guest.arrived ? now : undefined,
    });
  };
  
  const filteredGuests = guestList.guests.filter(guest =>
    guest.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const sortedGuests = [...filteredGuests].sort((a, b) => {
    if (sortBy === "arrived") {
      if (a.arrived && !b.arrived) return -1;
      if (!a.arrived && b.arrived) return 1;
      return a.name.localeCompare(b.name);
    }
    return a.name.localeCompare(b.name);
  });
  
  const arrivedCount = filteredGuests.filter(g => g.arrived).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-2xl">{guestList.title}</CardTitle>
              <CardDescription className="flex flex-col space-y-1">
                <span className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(guestList.eventDate), "EEEE, MMMM do, yyyy")}
                </span>
                <span className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4" />
                  {guestList.promoterName}
                </span>
              </CardDescription>
            </div>
            <Badge className="self-start md:self-center text-md px-3 py-1 h-auto">
              <Users className="w-4 h-4 mr-1" />
              {arrivedCount} / {filteredGuests.length} Arrived
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setSortBy(sortBy === "name" ? "arrived" : "name")}
              className="md:w-auto w-full"
            >
              <ArrowDownUp className="mr-2 h-4 w-4" />
              Sort by {sortBy === "name" ? "Status" : "Name"}
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {sortedGuests.length > 0 ? (
              sortedGuests.map((guest) => (
                <div
                  key={guest.id}
                  className={`guest-row ${guest.arrived ? "bg-green-900/20" : ""}`}
                >
                  <div className="flex items-center">
                    <span className={guest.guestOf ? "opacity-75" : ""}>
                      {guest.name}
                    </span>
                    <GenderBadge gender={guest.gender} />
                  </div>
                  <Button
                    size="sm"
                    variant={guest.arrived ? "default" : "outline"}
                    onClick={() => toggleGuestArrival(guest)}
                    className="checkin-button"
                  >
                    {guest.arrived ? "Arrived" : "Check In"}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No guests found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestListDetail;
