
import { User, GuestList, Guest, GenderType } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Venue Manager',
    email: 'venue@yourguestlist.com',
    role: 'venue',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Sam Smith',
    email: 'sam@promoter.com',
    role: 'promoter',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '3',
    name: 'Alex Johnson',
    email: 'alex@promoter.com',
    role: 'promoter',
    createdAt: new Date('2023-02-10'),
  },
];

// Helper function to parse guest string and extract gender
const parseGuest = (guestString: string): { name: string; gender: GenderType } => {
  const words = guestString.trim().split(' ');
  let gender: GenderType = undefined;
  let name = guestString.trim();
  
  // Check the last word for gender indicators
  const lastWord = words[words.length - 1].toLowerCase();
  
  if (lastWord === 'm' || lastWord === 'male') {
    gender = 'male';
    name = words.slice(0, -1).join(' ');
  } else if (lastWord === 'f' || lastWord === 'female') {
    gender = 'female';
    name = words.slice(0, -1).join(' ');
  } else if (lastWord === 'n' || lastWord === 'neutral') {
    gender = 'neutral';
    name = words.slice(0, -1).join(' ');
  }
  
  return { name, gender };
};

// Helper function to create guest entries from a text input
export const parseGuestList = (text: string, guestListId: string): Guest[] => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  const guests: Guest[] = [];
  
  lines.forEach(line => {
    // Check for +X format
    const plusMatch = line.match(/\+\s*(\d+)$/);
    if (plusMatch) {
      const count = parseInt(plusMatch[1], 10);
      const baseName = line.replace(/\+\s*\d+$/, '').trim();
      const { name, gender } = parseGuest(baseName);
      
      // Add main guest
      guests.push({
        id: `${guestListId}-${guests.length + 1}`,
        name,
        gender,
        arrived: false,
        guestListId,
      });
      
      // Add additional guests
      for (let i = 0; i < count; i++) {
        guests.push({
          id: `${guestListId}-${guests.length + 1}`,
          name: `${name} (Guest)`,
          gender,
          arrived: false,
          guestOf: name,
          guestListId,
        });
      }
    } else {
      const { name, gender } = parseGuest(line);
      guests.push({
        id: `${guestListId}-${guests.length + 1}`,
        name,
        gender,
        arrived: false,
        guestListId,
      });
    }
  });
  
  return guests;
};

// Generate mock guest lists
export const generateMockGuestLists = (): GuestList[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayEventDate = new Date(today);
  todayEventDate.setHours(22, 0, 0, 0);
  
  const tomorrowEventDate = new Date(tomorrow);
  tomorrowEventDate.setHours(22, 0, 0, 0);

  const fridayNightGuests = parseGuestList(
    `David Danks M\nLiam Wise\nStefan Kovacovic + 2\nSarah Jones F\nAlex Kim N`,
    'gl1'
  );
  
  const saturdayNightGuests = parseGuestList(
    `Michael Brown M\nJessica Lee F\nJamie Taylor + 1\nChris Wong\nRachel Green F`,
    'gl2'
  );
  
  const vipListGuests = parseGuestList(
    `Emma Watson F\nTom Holland M\nZendaya F\nRobert Pattinson M\nJennifer Lawrence F + 1`,
    'gl3'
  );

  return [
    {
      id: 'gl1',
      title: "Sam's List - Friday Night",
      eventDate: todayEventDate,
      createdAt: new Date(today.getTime() - 86400000), // 1 day ago
      promoterId: '2',
      promoterName: 'Sam Smith',
      venueId: '1',
      guests: fridayNightGuests,
    },
    {
      id: 'gl2',
      title: "Alex's Saturday Party",
      eventDate: tomorrowEventDate,
      createdAt: new Date(today.getTime() - 172800000), // 2 days ago
      promoterId: '3',
      promoterName: 'Alex Johnson',
      venueId: '1',
      guests: saturdayNightGuests,
    },
    {
      id: 'gl3',
      title: "Sam's VIP List",
      eventDate: todayEventDate,
      createdAt: new Date(today.getTime() - 43200000), // 12 hours ago
      promoterId: '2',
      promoterName: 'Sam Smith',
      venueId: '1',
      guests: vipListGuests,
    },
  ];
};

export const mockGuestLists = generateMockGuestLists();

// Calculate summary stats for each guest list
export const mockGuestListSummaries = mockGuestLists.map(list => ({
  id: list.id,
  title: list.title,
  eventDate: list.eventDate,
  promoterId: list.promoterId,
  promoterName: list.promoterName,
  guestCount: list.guests.length,
  arrivedCount: list.guests.filter(g => g.arrived).length,
}));

// Mock function to get guest lists for a specific date
export const getGuestListsByDate = (date: Date) => {
  const dateString = date.toISOString().split('T')[0];
  return mockGuestLists.filter(list => 
    list.eventDate.toISOString().split('T')[0] === dateString
  );
};

// Mock function to get guest lists for a specific promoter
export const getGuestListsByPromoter = (promoterId: string) => {
  return mockGuestLists.filter(list => list.promoterId === promoterId);
};
