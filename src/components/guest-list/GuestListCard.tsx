
import React from "react";
import { GuestList } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Users, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

interface GuestListCardProps {
  guestList: GuestList;
}

const GuestListCard: React.FC<GuestListCardProps> = ({ guestList }) => {
  const arrivedCount = guestList.guests.filter(g => g.arrived).length;
  const totalGuests = guestList.guests.length;
  const arrivalPercentage = totalGuests > 0 ? Math.round((arrivedCount / totalGuests) * 100) : 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{guestList.title}</CardTitle>
          <Badge variant={arrivedCount > 0 ? "default" : "secondary"}>
            {arrivedCount}/{totalGuests} Arrived
          </Badge>
        </div>
        <CardDescription className="flex flex-col space-y-1">
          <span className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(guestList.eventDate), "EEEE, MMMM do, yyyy")}
          </span>
          <span className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            {guestList.promoterName}
          </span>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="h-2 bg-secondary w-full rounded-full">
              <div 
                className="h-2 bg-primary rounded-full" 
                style={{ width: `${arrivalPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium">{arrivalPercentage}%</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex space-x-2 w-full">
          <Button asChild className="flex-1">
            <Link to={`/check-in/${guestList.id}`}>
              Check In
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/guest-lists/${guestList.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GuestListCard;
