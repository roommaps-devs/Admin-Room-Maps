"use client";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "./store";
import { ReactNode, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { setUser, clearUser } from "./userSlice";
import { postRequest, getRequest } from "@/lib/apiCall";

function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated) return;
      
      const token = getCookie("drive_access_token");

      if (token) {
        try {
          const res = await postRequest<any>("/admin/verify", { accessToken: token });
          if (res.success) {
            // Fetch the full admin profile after token verification
            let adminData = res.data?.user || res.data;
            try {
              const profileRes = await getRequest<any>("/admin/profile");
              if (profileRes.success && profileRes.data) {
                adminData = profileRes.data.user || profileRes.data;
              }
            } catch (profileErr) {
              console.warn("Failed to fetch admin profile during initAuth:", profileErr);
            }

            dispatch(setUser(adminData));
          } else {
            deleteCookie("drive_access_token");
            dispatch(clearUser());
          }
        } catch (error) {
          console.warn("Auth verification failed:", error);
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
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
