"use client";

import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Dashboard() {
  const userState = useSelector((state: any) => state.user);

  useEffect(() => {
    console.log("Redux User State:", userState);
  }, [userState]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Redux User Data:</h2>
        <pre className="bg-gray-50 p-4 rounded overflow-auto border">
          {JSON.stringify(userState, null, 2)}
        </pre>
      </div>
    </div>
  );
}