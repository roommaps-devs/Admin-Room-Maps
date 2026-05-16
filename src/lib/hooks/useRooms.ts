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

export function useAddRoom() {
  return {
    mutate: (room: Partial<Room>) => console.log('Adding room:', room),
    isLoading: false,
  };
}
