// TypeScript Type Definitions

export interface User {
  _id: string;
  googleId?: string;
  name: string;
  email: string;
  avatar?: string;
  profileImage?: string;
  city?: string;
  bikeType?: string;
  bikeModel?: string;
  bio?: string;
  joinedCommunities?: (string | Community)[];
  registeredEvents?: (string | Event)[];
  followers?: string[];
  following?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Community {
  _id: string;
  name: string;
  description: string;
  city: string;
  bikeType: string;
  coverImage?: string;
  admin: string | User;
  moderators?: string[];
  members?: Array<{
    user: string | User;
    joinedAt: Date;
  }>;
  memberCount: number;
  isPublic: boolean;
  rules?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  organizer: string | User;
  community: string | Community;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  maxParticipants: number;
  currentParticipants: number;
  participants?: Array<{
    user: string | User;
    registeredAt: Date;
    status: 'registered' | 'cancelled';
  }>;
  eventType: 'Ride' | 'Meetup' | 'Tour' | 'Racing' | 'Charity' | 'Other';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  distance?: number;
  coverImage?: string;
  requirements?: string[];
  isPublic: boolean;
  isActive: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  author: string | User;
  community: string | Community;
  content: string;
  images?: string[];
  postType: 'text' | 'image' | 'ride_experience' | 'event_update' | 'general';
  likes?: Array<{
    user: string | User;
    likedAt: Date;
  }>;
  comments?: Array<{
    _id: string;
    author: string | User;
    content: string;
    createdAt: Date;
    likes?: Array<{
      user: string | User;
      likedAt: Date;
    }>;
  }>;
  tags?: string[];
  isPinned: boolean;
  isActive: boolean;
  rideDetails?: {
    distance?: number;
    duration?: number;
    route?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    weather?: string;
    bikeModel?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

