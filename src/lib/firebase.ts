import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export async function getFcmToken(): Promise<string> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "web_fcm_token_placeholder";
  }

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("[FCM] Messaging is not supported in this browser environment.");
      return "web_fcm_token_placeholder";
    }

    const messaging = getMessaging(app);

    // Request permission if not already granted
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }

    if (Notification.permission !== "granted") {
      console.warn("[FCM] Notification permission was not granted by the user.");
      return "web_fcm_token_placeholder";
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || undefined,
    });

    if (token) {
      return token;
    }
  } catch (error) {
    console.warn("[FCM] Failed to generate local FCM Token, returning fallback token:", error);
  }

  return "web_fcm_token_placeholder";
}