export interface Room {
  id: string;
  name: string;
  city: string;
  state?: string;
  rent: number;
  lat: number;
  lng: number;
  category: string;
  type: string;
  image?: string;
  images?: string[];
  isTrending?: boolean;
  location?: string;
  area?: string;
  isTravelerFriendly?: boolean;
  rentType?: string;
  furnished?: string;
  owner?: string;
  phone?: string;
  amenities?: string[];
  bhk?: string;
  gender?: string;
  isFavorite?: boolean;
  userId?: string;
  createdByEmail?: string;
  createdAt?: string;
}

export interface User {
  uid: string;
  id?: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  name?: string | null;
  image?: string | null;
}

export interface SearchSuggestion {
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    display_name?: string;
    [key: string]: unknown;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}
