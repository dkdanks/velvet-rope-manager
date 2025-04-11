
import React, { useState } from "react";
import { useGuestLists } from "@/context/GuestListContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

const GuestListForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guestText, setGuestText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedPromoter, setSelectedPromoter] = useState("venue");
  const [createdGuestList, setCreatedGuestList] = useState<{ id: string, title: string } | null>(null);
  
  const { createGuestList } = useGuestLists();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !guestText) return;

    setIsSubmitting(true);
    try {
      // Pass the promoter ID (or "venue" if venue manager is selected)
      const newGuestListId = createGuestList(title, date, guestText, selectedPromoter);
      
      // Store created guest list details for success message
      setCreatedGuestList({
        id: newGuestListId,
        title: title
      });
      
      // Reset form
      setTitle("");
      setGuestText("");
      setDate(new Date());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnother = () => {
    setCreatedGuestList(null);
  };

  return (
    <>
      {createdGuestList ? (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Guest List Created!</h2>
            <p className="text-gray-500 mb-6">"{createdGuestList.title}" has been successfully created.</p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button 
                asChild
                className="bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                <Link to={`/guest-lists/${createdGuestList.id}`}>
                  View Guest List
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleCreateAnother}
                className="border-gray-200 hover:bg-gray-50 rounded-lg"
              >
                Create Another
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-gray-800">Create Guest List</CardTitle>
            <CardDescription className="text-gray-500">
              Add a new guest list for your event
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-gray-700">Guest List Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., VIP Friday Night"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-gray-200 focus:border-gray-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="promoter" className="text-gray-700">Associated With</Label>
                <Select value={selectedPromoter} onValueChange={setSelectedPromoter}>
                  <SelectTrigger className="w-full border-gray-200 rounded-lg">
                    <SelectValue placeholder="Select who this list belongs to" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="venue">Venue Manager</SelectItem>
                    {/* If user is a venue, they can select any promoter */}
                    {user?.role === "venue" && (
                      <>
                        <SelectItem value="1">John (Promoter)</SelectItem>
                        <SelectItem value="2">Sarah (Promoter)</SelectItem>
                        {/* In a real app, these would be dynamically loaded from the database */}
                      </>
                    )}
                    {/* If user is a promoter, they can only select themselves */}
                    {user?.role === "promoter" && (
                      <SelectItem value={user.id}>{user.name} (Me)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="date" className="text-gray-700">Event Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-200 rounded-lg",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-lg">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="rounded-lg"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="guests" className="text-gray-700">Guest List</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHelp(!showHelp)}
                    className="h-6 px-2 text-xs text-gray-500 rounded-lg"
                  >
                    {showHelp ? "Hide Format Help" : "Format Help"}
                  </Button>
                </div>
                
                {showHelp && (
                  <Alert className="rounded-lg">
                    <AlertDescription className="text-xs space-y-1 text-gray-600">
                      <p>Enter each guest on a new line. Examples:</p>
                      <p><code>John Smith</code> - Basic entry</p>
                      <p><code>Sarah Jones F</code> or <code>Sarah Jones Female</code> - With gender</p>
                      <p><code>Mike Johnson M</code> or <code>Mike Johnson Male</code> - With gender</p>
                      <p><code>Alex Taylor N</code> or <code>Alex Taylor Neutral</code> - With gender</p>
                      <p><code>David Wilson + 2</code> - Guest with 2 additional guests</p>
                    </AlertDescription>
                  </Alert>
                )}
                
                <Textarea
                  id="guests"
                  placeholder="Enter guest names (one per line)"
                  value={guestText}
                  onChange={(e) => setGuestText(e.target.value)}
                  rows={8}
                  required
                  className="border-gray-200 resize-none focus:border-gray-300 rounded-lg"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Guest List"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </>
  );
};

export default GuestListForm;
