// "use client";
// import { useEffect } from "react"
// import { ResponseMessage } from "./ResponseMessage"
// import { useRouter } from "next/navigation";
// import { setCookie } from "cookies-next";
// import { useDispatch } from "react-redux";
// import { setUser } from "@/store/userSlice";
// import { postRequest } from "@/lib/apiCall";

// export default function GoogleLogin() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     google.accounts.id.initialize({
//       client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//       callback: handleCredentialResponse,
//     })

//     google.accounts.id.renderButton(
//       document.getElementById("googleBtn")!,
//       { theme: "outline", size: "large", type: "standard" }
//     )
//   }, [])

//   const handleCredentialResponse = async (response: any) => {
//     console.log(response, "response");
//     try {
//       const res = await fetch("http://localhost:8000/api/auth/google", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include", // 🔥 VERY IMPORTANT (for cookies)
//         body: JSON.stringify({
//           token: response.credential,
//         }),
//       })

//       const data = await res.json()
//       ResponseMessage(data);

//       if (data.success) {
//         const token = data.data.accessToken;
//        const verifyToken = async (token: string, userData?: any) => {
//          if (token) {
//            const res = await postRequest("/auth/verify", {accessToken: token});
//             setCookie("drive_access_token", token);
//            if (res.success) {
//              dispatch(setUser(res.data?.user || res.data || userData));
//              router.push("/dashboard");
//            }else{
//              router.push("/");
//            }
//          }
//        };
//        verifyToken(token);
//       }
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   return <div id="googleBtn"></div>
// }

"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { postRequest } from "@/lib/apiCall";
import { ResponseMessage, catchResponseMessage } from "@/components/ResponseMessage";
import { useState } from "react";

export default function GoogleLogin() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // Firebase JWT Token
      const token = await user.getIdToken();

      // Backend API Call
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      ResponseMessage(data);

      if (data.success) {
        const accessToken = data.data.accessToken;

        // Verify token & set user
        if (accessToken) {
          const verifyRes = await postRequest("/auth/verify", { accessToken });
          setCookie("drive_access_token", accessToken);

          if (verifyRes.success) {
            dispatch(setUser(verifyRes.data?.user || verifyRes.data || data.data?.user));
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        }
      }

    } catch (error) {
      console.log(error);
      catchResponseMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={loginWithGoogle}
      disabled={loading}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        width: "100%",
        padding: "12px 24px",
        backgroundColor: "#ffffff",
        color: "#3c4043",
        border: "1px solid #dadce0",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: 500,
        fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        transition: "all 0.2s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
          e.currentTarget.style.backgroundColor = "#f8f9fa";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
        e.currentTarget.style.backgroundColor = "#ffffff";
      }}
    >
      {loading ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          style={{ animation: "spin 1s linear infinite" }}
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="#dadce0"
            strokeWidth="2.5"
            fill="none"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            stroke="#4285f4"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="16 34"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      )}
      <span>{loading ? "Signing in..." : "Continue with Google"}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}