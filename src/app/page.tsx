import AdminDashboard from "@/components/AdminDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RoomMaps Admin Console | Zero Brokerage Stays",
  description:
    "Administration panel for RoomMaps. Manage room listings, PG accommodations, analytics, and user reports in real time.",
  keywords: [
    "room for rent in India",
    "zero brokerage rooms",
    "admin dashboard",
    "RoomMaps admin",
  ],
  authors: [{ name: "RoomMaps Admin", url: "https://www.roommaps.in" }],
  metadataBase: new URL("https://www.roommaps.in"),
  alternates: { canonical: "/" },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#0A0A0A]">
      <AdminDashboard />
    </div>
  );
}