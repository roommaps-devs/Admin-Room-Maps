"use client";

import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "@/store/userSlice";
import { setMode, setProfileMenu } from "@/store/uiSlice";
import { deleteCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";
import Navbar from "./ui/Navbar";
import { RootState } from "@/store/store";

export default function Header() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
  const { mode, isProfileMenuOpen } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    deleteCookie("drive_access_token");
    dispatch(clearUser());
    dispatch(setProfileMenu(false));
    router.push("/login");
  };

  const openProfileMenu = () => dispatch(setProfileMenu(true));
  const closeProfileMenu = () => dispatch(setProfileMenu(false));

  // Hide header on auth pages
  if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") return null;

  return (
    <Navbar 
      mode={mode}
      setMode={(m) => dispatch(setMode(m))}
      user={isAuthenticated ? user : null}
      logout={handleLogout}
      isProfileMenuOpen={isProfileMenuOpen}
      openProfileMenu={openProfileMenu}
      closeProfileMenu={closeProfileMenu}
      menuRef={menuRef}
    />
  );
}
