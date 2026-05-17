import { useState, useEffect } from 'react';
import { getRooms } from '@/lib/data';
import { Room } from '@/lib/types';

export function useRooms() {
  const [data, setData] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rooms = getRooms() as Room[];
    setData(rooms);
    setIsLoading(false);
  }, []);

  return { data, isLoading };
}

export function useUniqueCities() {
  const { data } = useRooms();
  const cities = Array.from(new Set(data.map(room => room.city).filter(Boolean)));
  return { data: cities };
}

import { addRoom } from '../data';

export function useAddRoom() {
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (roomData: any) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newId = Math.random().toString(36).substring(2, 9);
    const newRoom: Room = {
      id: newId,
      name: roomData.name || 'Room Listing',
      city: roomData.city || 'Chandigarh',
      rent: Number(roomData.rent) || 10000,
      lat: Number(roomData.lat) || 30.7333,
      lng: Number(roomData.lng) || 76.7794,
      category: roomData.category || 'rent',
      type: roomData.propertyType || 'Room',
      image: roomData.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    };
    addRoom(newRoom);
    setIsLoading(false);
    return newId;
  };

  return {
    mutateAsync,
    isLoading,
  };
}

export function useAddRoomImages() {
  return {
    mutateAsync: async (imageData: any) => {
      console.log('Adding image:', imageData);
      return true;
    },
    isLoading: false,
  };
}

