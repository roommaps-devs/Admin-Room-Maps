import { type NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-room-maps.onrender.com').replace(/\/api\/?$/, '');

// Server-side helper to retrieve session tokens from request headers or cookies
async function retrieveToken(request: NextRequest): Promise<string | undefined> {
  // 1. Try Authorization header first
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // 2. Fallback to Next.js cookie store (asynchronous in Next.js 15+)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('drive_access_token')?.value || cookieStore.get('roommaps_auth')?.value;
    if (token) return token;
  } catch (err) {
    console.warn('Failed to retrieve session token from cookies on server:', err);
  }

  return undefined;
}

// Helper to construct headers with optional bearer authentication
function getHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Safe JSON parser to gracefully handle non-JSON (HTML/text) backend errors
async function safeParseJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      statusCode: res.status,
      message: `Backend returned HTML/non-JSON response. HTTP Status: ${res.status}`,
      error: text.substring(0, 500),
    };
  }
}

/**
 * GET /admin/posts/[id]
 * Proxies request to backend /admin/posts/[id] with resilient fallback to /post/getById/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = await retrieveToken(request);

  try {
    // 1. Try standard admin endpoint
    console.log(`[API Proxy] GET: Fetching admin post details for ID ${id} from backend...`);
    let res = await fetch(`${BACKEND_URL}/admin/posts/${id}`, {
      method: 'GET',
      headers: getHeaders(token),
      cache: 'no-store',
    });

    // 2. Fallback to standard post details if admin endpoint is unavailable or returns 404
    if (!res.ok) {
      console.warn(`[API Proxy] GET /admin/posts/${id} failed (${res.status}). Trying fallback /post/getById/${id}...`);
      res = await fetch(`${BACKEND_URL}/post/getById/${id}`, {
        method: 'GET',
        headers: getHeaders(token),
        cache: 'no-store',
      });
    }

    const data = await safeParseJson(res);
    
    // Normalize response format to ensure it conforms exactly to:
    // { success: true, statusCode: 200, message: "Post fetched successfully", data: { ... } }
    let formattedResponse = data;
    if (res.ok && data && !('error' in data)) {
      if (data && typeof data === 'object' && !('data' in data)) {
        formattedResponse = {
          success: true,
          statusCode: res.status,
          message: 'Post fetched successfully',
          data: data,
        };
      } else if (data && typeof data === 'object' && 'data' in data) {
        formattedResponse = {
          success: data.success !== undefined ? data.success : true,
          statusCode: data.statusCode || res.status,
          message: data.message || 'Post fetched successfully',
          data: data.data,
        };
      }
    }

    return Response.json(formattedResponse, { status: res.status });
  } catch (err) {
    console.error(`[API Proxy] GET failed for post ID ${id}:`, err);
    return Response.json(
      { success: false, message: err instanceof Error ? err.message : 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

/**
 * PUT /admin/posts/[id]
 * Updates a listing entry (proxies to backend /admin/posts/[id] with fallback to /post/update/[id])
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = await retrieveToken(request);
  let requestBody: any;

  try {
    requestBody = await request.json();
  } catch {
    requestBody = {};
  }

  try {
    // 1. Try standard admin endpoint
    console.log(`[API Proxy] PUT: Updating admin post entry for ID ${id}...`);
    let res = await fetch(`${BACKEND_URL}/admin/posts/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    // 2. Fallback to general post update endpoint if PUT is not allowed or 404
    if (!res.ok) {
      console.warn(`[API Proxy] PUT /admin/posts/${id} failed (${res.status}). Trying fallback POST /post/update/${id}...`);
      res = await fetch(`${BACKEND_URL}/post/update/${id}`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(requestBody),
        cache: 'no-store',
      });
    }

    const data = await safeParseJson(res);
    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error(`[API Proxy] PUT failed for post ID ${id}:`, err);
    return Response.json(
      { success: false, message: err instanceof Error ? err.message : 'Failed to update post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /admin/posts/[id]
 * Deletes a listing entry (proxies to backend /admin/posts/[id] with fallback to /post/delete/[id])
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = await retrieveToken(request);

  try {
    // 1. Try standard admin endpoint
    console.log(`[API Proxy] DELETE: Removing admin post entry for ID ${id}...`);
    let res = await fetch(`${BACKEND_URL}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
      cache: 'no-store',
    });

    // 2. Fallback to general delete endpoint
    if (!res.ok) {
      console.warn(`[API Proxy] DELETE /admin/posts/${id} failed (${res.status}). Trying fallback DELETE /post/delete/${id}...`);
      res = await fetch(`${BACKEND_URL}/post/delete/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token),
        cache: 'no-store',
      });
    }

    const data = await safeParseJson(res);
    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error(`[API Proxy] DELETE failed for post ID ${id}:`, err);
    return Response.json(
      { success: false, message: err instanceof Error ? err.message : 'Failed to delete post' },
      { status: 500 }
    );
  }
}
