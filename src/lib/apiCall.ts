import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// Resilient cookie parser to guarantee cookie reading on client side under all edge cases
function getCookieVanilla(name: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

// Unified session token retriever with cross-framework & vanilla DOM fallbacks
function retrieveToken(): string | undefined {
  const token = getCookieVanilla("drive_access_token") || 
                (getCookie("drive_access_token") as any) || 
                getCookieVanilla("roommaps_auth") || 
                (getCookie("roommaps_auth") as any);

  return typeof token === 'string' ? token : undefined;
}

export async function postRequest<T = unknown>(
  endpoint: string,
  data?: unknown
): Promise<T> {
  const token = retrieveToken();

  const res = await fetch(`${baseURL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : undefined,
    cache: "no-store",
  });

  let responseData;

  try {
    responseData = await res.json();
  } catch {
    responseData = null;
  }

  if (!res.ok) {
    throw new Error(responseData?.message || "POST request failed");
  }
  return responseData;
}

export async function getRequest<T = unknown>(
  endpoint: string,
): Promise<T> {
  const token = retrieveToken();

  const res = await fetch(`${baseURL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  let responseData;

  try {
    responseData = await res.json();
  } catch {
    responseData = null;
  }

  if (!res.ok) {
    throw new Error(responseData?.message || "GET request failed");
  }
  return responseData;
}

export async function uploadRequest<T = unknown>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const token = retrieveToken();

  const res = await fetch(`${baseURL}${endpoint}`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
    cache: "no-store",
  });

  let responseData;

  try {
    responseData = await res.json();
  } catch {
    responseData = null;
  }

  if (!res.ok) {
    throw new Error(responseData?.message || "File upload failed");
  }
  return responseData;
}

export async function deleteRequest<T = unknown>(
  endpoint: string,
): Promise<T> {
  const token = retrieveToken();

  const res = await fetch(`${baseURL}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: "no-store",
  });

  let responseData;

  try {
    responseData = await res.json();
  } catch {
    responseData = null;
  }

  if (!res.ok) {
    throw new Error(responseData?.message || "DELETE request failed");
  }
  return responseData;
}