
import React, { useState, useEffect } from "react";
import { useGuestLists } from "@/context/GuestListContext";
import { GuestList, Guest, GenderType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Search, ArrowDownUp, Calendar, User as UserIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GuestListDetailProps {
  guestListId: string;
}

const GenderBadge: React.FC<{ gender?: GenderType }> = ({ gender }) => {
  if (!gender) return null;
  
  const classes = {
    male: "bg-blue-100 text-blue-800 border border-blue-200",
    female: "bg-pink-100 text-pink-800 border border-pink-200",
    neutral: "bg-purple-100 text-purple-800 border border-purple-200",
  };
  
  return (
    <Badge variant="outline" className={`ml-2 ${classes[gender]}`}>
      {gender.charAt(0).toUpperCase()}
    </Badge>
  );
};

const GuestListDetail: React.FC<GuestListDetailProps> = ({ guestListId }) => {
  const { getGuestListById, updateGuest } = useGuestLists();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "arrived">("name");
  const guestList = getGuestListById(guestListId);
  const [currentPage, setCurrentPage] = useState(1);
  const guestsPerPage = 10;
  
  if (!guestList) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800">Guest List Not Found</h2>
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
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedGuests.length / guestsPerPage);
  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = sortedGuests.slice(indexOfFirstGuest, indexOfLastGuest);
  
  const arrivedCount = filteredGuests.filter(g => g.arrived).length;

  return (
    <div className="space-y-4">
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-2xl text-gray-800">{guestList.title}</CardTitle>
              <CardDescription className="flex flex-col space-y-1 text-gray-500">
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
            <Badge className="self-start md:self-center text-md px-3 py-1 h-auto bg-gray-100 text-gray-800 border border-gray-200">
              <Users className="w-4 h-4 mr-1" />
              {arrivedCount} / {filteredGuests.length} Arrived
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search guests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 border-gray-200"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setSortBy(sortBy === "name" ? "arrived" : "name")}
              className="md:w-auto w-full border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <ArrowDownUp className="mr-2 h-4 w-4" />
              Sort by {sortBy === "name" ? "Status" : "Name"}
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {currentGuests.length > 0 ? (
              currentGuests.map((guest) => (
                <div
                  key={guest.id}
                  className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                    guest.arrived 
                      ? "bg-green-50 border border-green-100" 
                      : "hover:bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`text-gray-800 ${guest.guestOf ? "opacity-75" : ""}`}>
                      {guest.name}
                    </span>
                    <GenderBadge gender={guest.gender} />
                  </div>
                  <Button
                    size="sm"
                    variant={guest.arrived ? "default" : "outline"}
                    onClick={() => toggleGuestArrival(guest)}
                    className={guest.arrived 
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" 
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"}
                  >
                    {guest.arrived ? "Arrived" : "Check In"}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No guests found.
              </div>
            )}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} 
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} 
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestListDetail;
