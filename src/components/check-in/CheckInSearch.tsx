
import React, { useState, useEffect } from "react";
import { useGuestLists } from "@/context/GuestListContext";
import { Guest, GenderType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CheckCircle, Calendar, User as UserIcon, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

interface CheckInSearchProps {
  selectedDate?: Date;
}

const CheckInSearch: React.FC<CheckInSearchProps> = ({ selectedDate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { searchGuests, guestLists, updateGuest, getPaginatedGuests } = useGuestLists();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalGuests, setTotalGuests] = useState(0);
  const [displayedGuests, setDisplayedGuests] = useState<Guest[]>([]);
  const limit = 10;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  useEffect(() => {
    if (searchTerm.length > 1) {
      const results = searchGuests(searchTerm, selectedDate);
      setDisplayedGuests(results.slice(0, limit));
      setTotalGuests(results.length);
    } else {
      // When no search term, show paginated list of all guests
      const { guests, total } = getPaginatedGuests(selectedDate, currentPage, limit);
      setDisplayedGuests(guests);
      setTotalGuests(total);
    }
  }, [searchTerm, selectedDate, currentPage, getPaginatedGuests, searchGuests]);
  
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

  const totalPages = Math.ceil(totalGuests / limit);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search for a guest by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 py-6 text-lg border-gray-200"
        />
      </div>
      
      <div className="space-y-4">
        {displayedGuests.length > 0 ? (
          displayedGuests.map((guest) => {
            const guestList = getGuestListById(guest.guestListId);
            return (
              <Card key={guest.id} className="overflow-hidden bg-white border border-gray-200">
                <CardHeader className="bg-gray-50 py-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CardTitle className="text-base md:text-lg flex items-center text-gray-800">
                        {guest.name}
                        <GenderBadge gender={guest.gender} />
                      </CardTitle>
                    </div>
                    <Badge variant={guest.arrived ? "default" : "outline"} 
                      className={guest.arrived ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                      {guest.arrived ? "Arrived" : "Not Arrived"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="grid md:grid-cols-2 gap-2">
                    {guestList && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                          <span>{format(new Date(guestList.eventDate), "EEE, MMM d")}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
                          <span>List: {guestList.promoterName}</span>
                        </div>
                      </>
                    )}
                    {guest.arrived && guest.arrivedAt && (
                      <div className="flex items-center text-sm md:col-span-2 text-gray-600">
                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                        <span>Arrived at {format(new Date(guest.arrivedAt), "h:mm a")}</span>
                      </div>
                    )}
                  </div>
                  
                  {!guest.arrived && (
                    <Button
                      className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-white"
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
            <p className="text-gray-500">No guests found with that name.</p>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No guests available for the selected date.</p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} 
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                // Show first page, last page, and pages around current page
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        isActive={pageNumber === currentPage}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default CheckInSearch;
