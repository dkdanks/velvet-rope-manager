
export type UserRole = 'venue' | 'promoter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Promoter extends User {
  role: 'promoter';
  venueId: string;
}

export type GenderType = 'male' | 'female' | 'neutral' | undefined;

export interface Guest {
  id: string;
  name: string;
  gender?: GenderType;
  arrived: boolean;
  arrivedAt?: Date;
  guestOf?: string; // For guests who are +1, +2, etc.
  guestListId: string;
}

export interface GuestList {
  id: string;
  title: string;
  eventDate: Date;
  createdAt: Date;
  promoterId: string;
  promoterName: string;
  venueId: string;
  guests: Guest[];
}

export interface GuestListSummary {
  id: string;
  title: string;
  eventDate: Date;
  promoterId: string;
  promoterName: string;
  guestCount: number;
  arrivedCount: number;
}
