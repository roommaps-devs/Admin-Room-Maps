import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const provider = searchParams.get('provider') || 'photon';

  if (!q) {
    return Response.json(provider === 'nominatim' ? [] : { features: [] });
  }

  try {
    if (provider === 'nominatim') {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ', India')}`,
        {
          headers: {
            'User-Agent': 'RoomMaps/1.0',
          },
        }
      );
      if (!res.ok) {
        return Response.json([]);
      }
      const data = await res.json();
      return Response.json(data);
    } else {
      // Default: photon.komoot.io autocomplete
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q + ', India')}&limit=5`,
        {
          headers: {
            'User-Agent': 'RoomMaps/1.0',
          },
        }
      );
      if (!res.ok) {
        return Response.json({ features: [] });
      }
      const data = await res.json();
      return Response.json(data);
    }
  } catch (err) {
    console.error(`Geocoding proxy fetch failed for provider ${provider}:`, err);
    return Response.json(provider === 'nominatim' ? [] : { features: [] });
  }
}
