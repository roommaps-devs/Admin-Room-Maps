"use client";

interface PostListingFormProps {
  mode: string;
  mapCenter: [number, number];
  searchQuery: string;
  reverseGeocode: (lat: number, lng: number) => Promise<string>;
  setLiveUserPos: (pos: [number, number] | null) => void;
  setSearchCenter: (coords: [number, number]) => void;
  setMapCenter: (coords: [number, number]) => void;
  onBack: () => void;
  onSuccess: () => void;
}

export default function PostListingForm({ 
  mode, 
  mapCenter, 
  searchQuery, 
  reverseGeocode, 
  setLiveUserPos, 
  setSearchCenter, 
  setMapCenter, 
  onBack, 
  onSuccess 
}: PostListingFormProps) {
  return (
    <div className="fixed inset-0 z-[5000] bg-white flex flex-col p-6 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-gray-500 font-bold">← Back</button>
        <h1 className="text-xl font-black">Post a Room</h1>
        <div className="w-10" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black mb-4">Coming Soon</h2>
        <p className="text-gray-500 max-w-xs mx-auto mb-10">We&apos;re putting the finishing touches on our property submission system.</p>
        <button onClick={onSuccess} className="px-12 py-4 bg-[#FF5733] text-white font-black rounded-full shadow-xl">Get Notified</button>
      </div>
    </div>
  );
}
