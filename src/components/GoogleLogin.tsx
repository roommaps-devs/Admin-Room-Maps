"use client";
import { useEffect } from "react"
import { ResponseMessage } from "./ResponseMessage"
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { postRequest } from "@/lib/apiCall";

export default function GoogleLogin() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredentialResponse,
    })

    google.accounts.id.renderButton(
      document.getElementById("googleBtn")!,
      { theme: "outline", size: "large", type: "standard" }
    )
  }, [])

  const handleCredentialResponse = async (response: any) => {
    console.log(response, "response");
    try {
      const res = await fetch("http://localhost:8000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 VERY IMPORTANT (for cookies)
        body: JSON.stringify({
          token: response.credential,
        }),
      })

      const data = await res.json()
      ResponseMessage(data);

      if (data.success) {
        const token = data.data.accessToken;
       const verifyToken = async (token: string, userData?: any) => {
         if (token) {
           const res = await postRequest("/auth/verify", {accessToken: token});
            setCookie("drive_access_token", token);
           if (res.success) {
             dispatch(setUser(res.data?.user || res.data || userData));
             router.push("/dashboard");
           }else{
             router.push("/");
           }
         }
       };
       verifyToken(token);
      }
    } catch (err) {
      console.error(err)
    }
  }

  return <div id="googleBtn"></div>
}