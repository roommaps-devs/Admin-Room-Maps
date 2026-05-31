import { useState, useEffect } from 'react';
import { getRooms } from '@/lib/data';
import { Room, PostStatus } from '@/lib/types';
import { getRequest, postRequest } from '../apiCall';

// Memory cache pointers for single-fetch promise deduplication and static caching
let cachedRooms: Room[] | null = null;
let roomsPromise: Promise<Room[]> | null = null;

export function clearRoomsCache() {
  cachedRooms = null;
  roomsPromise = null;
}

// Resilient image URL resolver to dynamically format absolute and relative paths
export function resolveImageUrl(url: string | undefined): string {
  if (!url) return '';
  
  let cleanUrl = url;
  
  // Format and secure Cloudinary URLs if present
  if (cleanUrl.includes('cloudinary.com')) {
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    } else if (cleanUrl.startsWith('http://')) {
      cleanUrl = cleanUrl.replace('http://', 'https://');
    }
  }

  // Automatically upgrade unsecure http calls to secure https to satisfy Next.js RemotePatterns policy
  if (cleanUrl.startsWith('http://backend-room-maps.onrender.com')) {
    cleanUrl = cleanUrl.replace('http://', 'https://');
  }

  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }

  // Prefix with NEXT_PUBLIC_IMAGE_URL if configured (e.g. Cloudinary base URL)
  const imageBase = process.env.NEXT_PUBLIC_IMAGE_URL;
  if (imageBase) {
    const base = imageBase.endsWith('/') ? imageBase : `${imageBase}/`;
    const path = cleanUrl.startsWith('/') ? cleanUrl.substring(1) : cleanUrl;
    return `${base}${path}`;
  }

  const backendBase = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-room-maps.onrender.com').replace(/\/api\/?$/, '');
  const path = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  return `${backendBase}${path}`;
}

export function useRooms() {
  const [data, setData] = useState<Room[]>(cachedRooms || []);
  const [isLoading, setIsLoading] = useState(!cachedRooms);

  useEffect(() => {
    // If listings are already cached in memory, load them instantly with zero network request
    if (cachedRooms) {
      setIsLoading(false);
      return;
    }

    const fetchRooms = async () => {
      // If there is already an in-flight API fetch promise, await it to avoid concurrent requests
      if (roomsPromise) {
        const rooms = await roomsPromise;
        setData(rooms);
        setIsLoading(false);
        return;
      }

      // Instantiate a unified promise so all concurrent useRooms mounts share this exact network request
      roomsPromise = (async () => {
        try {
          const res = await getRequest<any>("/admin/posts");
          
          let rawData: any[] = [];
          if (Array.isArray(res)) {
            rawData = res;
          } else if (res && Array.isArray(res.data)) {
            rawData = res.data;
          } else if (res && Array.isArray(res.posts)) {
            rawData = res.posts;
          } else if (res && res.success && Array.isArray(res.data)) {
            rawData = res.data;
          }

          if (rawData.length > 0 || (res && (Array.isArray(res) || res.success))) {
            const filteredRawData = rawData.filter((item: any) => 
              item && 
              typeof item === 'object' && 
              item.name && 
              item.owner && 
              item.phone && 
              item.city
            );

            const mappedRooms: Room[] = filteredRawData.map((item: any) => {
              const firstImageObj = item.images?.[0];
              const rawImg = firstImageObj?.uploadUrl || 
                             firstImageObj?.url || 
                             (typeof firstImageObj === 'string' ? firstImageObj : null) || 
                             item.image || 
                             item.imageUrl;

              const imagesList = Array.isArray(item.images)
                ? item.images.map((img: any) => 
                    typeof img === 'string' ? img : (img.uploadUrl || img.url)
                  ).filter(Boolean)
                : [];

              return {
                id: item.id,
                name: item.name || item.title || 'Room Listing',
                city: item.city || 'Chandigarh',
                state: item.state || 'Punjab',
                rent: Number(item.rent) || 10000,
                lat: Number(item.lat) || 30.7333,
                lng: Number(item.lng) || 76.7794,
                category: String(item.category || 'rent').toLowerCase(),
                type: item.type || item.propertyType || 'Room',
                image: resolveImageUrl(rawImg),
                images: imagesList,
                location: item.location || item.address || [item.city, item.state].filter(Boolean).join(', ') || 'Sector Area',
                isTrending: !!item.isTrending,
                owner: item.owner || 'Anonymous',
                phone: item.phone || '',
                amenities: item.amenities || [],
                furnished: item.furnished || 'Unfurnished',
                bhk: item.bhk || '1 BHK',
                gender: item.gender,
                createdAt: item.createdAt,
                status: (item.status ? String(item.status).toUpperCase() : 'ACTIVE') as PostStatus
              };
            });
            cachedRooms = mappedRooms;
            return mappedRooms;
          } else {
            cachedRooms = getRooms() as Room[];
            return cachedRooms;
          }
        } catch (err) {
          console.error("Failed to fetch rooms from backend API, using local mock fallbacks:", err);
          cachedRooms = getRooms() as Room[];
          return cachedRooms;
        }
      })();

      const rooms = await roomsPromise;
      setData(rooms);
      setIsLoading(false);
    };
    
    fetchRooms();
  }, []);

  return { data, isLoading };
}

export function useUniqueCities() {
  const { data } = useRooms();
  const cities = Array.from(new Set(data.map(room => room.city).filter(Boolean)));
  return { data: cities };
}

export function useAddRoom() {
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (roomData: any) => {
    setIsLoading(true);
    try {
      const res = await postRequest<{ success: boolean; data: any }>("/post/create", { data: roomData });
      setIsLoading(false);
      clearRoomsCache(); // Invalidate cache so the next visit loads the freshly added listing E2E!
      return res?.data?.id || res?.data?.postId || Math.random().toString();
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to create post on API:", error);
      throw error;
    }
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
