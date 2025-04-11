import React, { createContext, useContext, useState, useEffect } from 'react';
import { GuestList, Guest } from '../types';
import { 
  mockGuestLists,
  parseGuestList,
} from '../lib/mockData';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface GuestListContextType {
  guestLists: GuestList[];
  getGuestListById: (id: string) => GuestList | undefined;
  getGuestListsByDate: (date: Date) => GuestList[];
  getGuestListsByPromoter: (promoterId: string) => GuestList[];
  createGuestList: (title: string, eventDate: Date, guestText: string, promoterId?: string) => string;
  updateGuest: (guestId: string, guestListId: string, updates: Partial<Guest>) => void;
  searchGuests: (query: string, date?: Date) => Guest[];
  getPaginatedGuests: (date?: Date, page?: number, limit?: number) => {guests: Guest[], total: number};
}

const GuestListContext = createContext<GuestListContextType | undefined>(undefined);

export const GuestListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guestLists, setGuestLists] = useState<GuestList[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, we'd fetch from an API
    setGuestLists(mockGuestLists);
  }, []);

  const getGuestListById = (id: string) => {
    return guestLists.find(list => list.id === id);
  };

  const getGuestListsByDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return guestLists.filter(list => 
      list.eventDate.toISOString().split('T')[0] === dateString
    );
  };

  const getGuestListsByPromoter = (promoterId: string) => {
    return guestLists.filter(list => list.promoterId === promoterId);
  };

  const createGuestList = (title: string, eventDate: Date, guestText: string, promoterId?: string): string => {
    if (!user) return '';

    const newId = `gl${Date.now()}`;
    const guests = parseGuestList(guestText, newId);
    
    // Use the provided promoterId or default to the current user's id
    const actualPromoterId = promoterId === "venue" ? "venue" : (promoterId || user.id);
    const promoterName = actualPromoterId === "venue" ? "Venue Manager" : user.name;
    
    const newGuestList: GuestList = {
      id: newId,
      title,
      eventDate,
      createdAt: new Date(),
      promoterId: actualPromoterId,
      promoterName: promoterName,
      venueId: '1', // In a real app, this would be the actual venue ID
      guests,
    };

    setGuestLists(prev => [...prev, newGuestList]);
    
    toast({
      title: "Guest list created",
      description: `'${title}' with ${guests.length} guests has been created.`,
    });
    
    return newId;
  };

  const updateGuest = (guestId: string, guestListId: string, updates: Partial<Guest>) => {
    setGuestLists(prev => 
      prev.map(list => {
        if (list.id !== guestListId) return list;
        
        const updatedGuests = list.guests.map(guest => 
          guest.id === guestId ? { ...guest, ...updates } : guest
        );
        
        return { ...list, guests: updatedGuests };
      })
    );
  };

  const searchGuests = (query: string, date?: Date): Guest[] => {
    const normalizedQuery = query.toLowerCase();
    let listsToSearch = guestLists;
    
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      listsToSearch = listsToSearch.filter(list => 
        list.eventDate.toISOString().split('T')[0] === dateStr
      );
    }
    
    return listsToSearch.flatMap(list => 
      list.guests.filter(guest => 
        guest.name.toLowerCase().includes(normalizedQuery)
      ).map(guest => ({
        ...guest,
        guestListId: list.id,
      }))
    );
  };

  const getPaginatedGuests = (date?: Date, page = 1, limit = 10): {guests: Guest[], total: number} => {
    let allGuests: Guest[] = [];
    
    let listsToSearch = guestLists;
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      listsToSearch = listsToSearch.filter(list => 
        list.eventDate.toISOString().split('T')[0] === dateStr
      );
    }
    
    allGuests = listsToSearch.flatMap(list => 
      list.guests.map(guest => ({
        ...guest,
        guestListId: list.id,
      }))
    );
    
    allGuests.sort((a, b) => a.name.localeCompare(b.name));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      guests: allGuests.slice(startIndex, endIndex),
      total: allGuests.length
    };
  };

  return (
    <GuestListContext.Provider value={{
      guestLists,
      getGuestListById,
      getGuestListsByDate,
      getGuestListsByPromoter,
      createGuestList,
      updateGuest,
      searchGuests,
      getPaginatedGuests,
    }}>
      {children}
    </GuestListContext.Provider>
  );
};

export const useGuestLists = () => {
  const context = useContext(GuestListContext);
  if (context === undefined) {
    throw new Error('useGuestLists must be used within a GuestListProvider');
  }
  return context;
};
