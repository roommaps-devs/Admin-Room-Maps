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
      
      const token = getCookie("drive_access_token");

      if (token) {
        try {
          const res = await postRequest<any>("/auth/verify", { accessToken: token });
          if (res.success) {
            dispatch(setUser(res.data?.user || res.data));
          } else {
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
