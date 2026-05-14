import { getCookie } from "cookies-next";

const baseURL = `http://localhost:8000/api`;

export async function postRequest<T = any>(
  endpoint: string,
  data?: any
): Promise<T> {


  const token = getCookie("drive_clone");



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


export async function getRequest<T = any>(
  endpoint: string,
): Promise<T> {


  const token = getCookie("drive_clone");

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