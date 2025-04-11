
import React, { useState } from "react";
import { useGuestLists } from "@/context/GuestListContext";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";

const GuestListForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guestText, setGuestText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  const { createGuestList } = useGuestLists();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !guestText) return;

    setIsSubmitting(true);
    try {
      createGuestList(title, date, guestText);
      // Reset form
      setTitle("");
      setGuestText("");
      setDate(new Date());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Guest List</CardTitle>
        <CardDescription>
          Add a new guest list for your event
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Guest List Title</Label>
            <Input
              id="title"
              placeholder="e.g., VIP Friday Night"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="date">Event Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <Label htmlFor="guests">Guest List</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(!showHelp)}
                className="h-6 px-2 text-xs"
              >
                {showHelp ? "Hide Format Help" : "Format Help"}
              </Button>
            </div>
            
            {showHelp && (
              <Alert>
                <AlertDescription className="text-xs space-y-1">
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
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Guest List"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GuestListForm;
