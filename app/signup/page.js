"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import Signup1 from "../components/signupComponents/Signup1";
import Signup2 from "../components/signupComponents/Signup2";
import Signup3 from "../components/signupComponents/Signup3";
import Signup4 from "../components/signupComponents/signup4";
import Signup5 from "../components/signupComponents/Signup5";


export default function RegisterPage() {
  const [error, setError] = useState();
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    password: "",
    profile_img_url: "",
    bio: "",
    username: "",
    DOB: "",
  })
  const [page, setPage] = useState(1);
  const [OTP, setOTP] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const res = await fetch(`${apiGatewayUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(
          setCredentials({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        );
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('userId', data.user.user_id);
        router.push("/profile");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex flex-row items-center justify-center h-screen bg-[#fdfdfd]">
      <div className="flex-1/2 w-full h-full px-20 py-10 hidden sm:hidden md:hidden lg:flex lg:items-center lg:justify-center">
        <div className="flex items-center justify-center h-full w-full bg-[#eeeeee]">
          Promotional content
        </div>
      </div>
      <div className="flex-1/2 w-full flex items-center justify-center">
        {page === 1 && <Signup1 userData={userData} setUserData={setUserData} setPage={setPage} setOTP={setOTP} />}
        {page === 2 && <Signup2 userData={userData} setUserData={setUserData} setPage={setPage} OTP={OTP} setOTP={setOTP} />}
        {page === 3 && <Signup3 userData={userData} setUserData={setUserData} setPage={setPage} />}
        {page === 4 && <Signup4 userData={userData} setUserData={setUserData} setPage={setPage} />}
        {page === 5 && <Signup5 userData={userData} setUserData={setUserData} setPage={setPage} onSave={handleSubmit} userError={error} />}
        {/* <Signup2 /> */}
        {/* <Signup3 /> */}
        {/* <Signup4 /> */}
        {/* <Signup5 /> */}
      </div>
    </div>
  );
}
