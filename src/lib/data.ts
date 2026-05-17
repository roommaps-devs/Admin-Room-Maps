import { Room } from "./types";

let roomsList: Room[] = [
  {
    id: '1',
    name: 'Luxury Studio in Chandigarh',
    city: 'Chandigarh',
    rent: 15000,
    lat: 30.7333,
    lng: 76.7794,
    category: 'rent',
    type: 'Studio',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Shared Room for Students',
    city: 'Mohali',
    rent: 5000,
    lat: 30.7046,
    lng: 76.7179,
    category: 'rent',
    type: 'Shared',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
  }
];

export const getRooms = () => roomsList;

export const addRoom = (room: Room) => {
  roomsList.push(room);
};

