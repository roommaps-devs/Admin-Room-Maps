"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "./store";
import { ReactNode, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { setUser } from "./userSlice";
import { postRequest } from "@/lib/apiCall";

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated) return;
      
      let token = getCookie("drive_access_token");

      // Check if running in PWA standalone mode
      const isPwa = typeof window !== "undefined" && (
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      );

      // If in PWA mode and cookie is cleared/expired, restore it from persistent localStorage
      if (!token && isPwa) {
        const persistedToken = localStorage.getItem("pwa_access_token");
        if (persistedToken) {
          token = persistedToken;
          setCookie("drive_access_token", persistedToken, { path: '/' });
        }
      }

      if (token) {
        try {
          const res = await postRequest<any>("/auth/verify", { accessToken: token });
          if (res.success) {
            dispatch(setUser(res.data?.user || res.data));
            // Keep localStorage token updated and active
            if (isPwa) {
              localStorage.setItem("pwa_access_token", token as string);
            }
          } else {
            // Token is invalid/expired: perform cleanup
            if (isPwa) {
              localStorage.removeItem("pwa_access_token");
            }
            deleteCookie("drive_access_token");
          }
        } catch (error) {
          console.error("Auth verification failed:", error);
        }
      }
    };
    
    initAuth();
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
