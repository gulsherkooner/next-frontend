"use client";
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProfileInfo from "../components/profileComponents/ProfileInfo";
import ProfileContent from "../components/profileComponents/ProfileContent";
import { useIsMobile } from "../hooks/use-mobile";
import MobileNav from "../components/MobileNav";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateAccessToken } from "../features/auth/authSlice";
import { fetchUserPosts } from "../features/posts/postsSlice";
import { getCookie } from "../lib/utils/cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function profile() {
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { userPosts } = useSelector((state) => state.posts);
  const data = useSelector((state) => state.auth?.user);
  console.log(data)

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = getCookie("accessToken");
      if (!accessToken) {
        const refreshToken = getCookie("refreshToken");
        if (!refreshToken) {
          router.push("/login");
        }
        try {
          const apiGatewayUrl =
            process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
          const res = await fetch(`${apiGatewayUrl}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            dispatch(
              updateAccessToken({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              })
            );
            router.push("/");
          } else {
            setError(data.error || "Login failed");
          }
        } catch (err) {
          console.error("Login error:", err);
          setError("An unexpected error occurred");
        }
      } else {
        dispatch(fetchUserData());
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    dispatch(fetchUserPosts(data?.user_id));
  }, [data?.user_id]);

  return (
    <div className="bg-gray-100 min-h-screen pb-14 md:pb-0 w-full">
      <Header setMenu={setMenu} menu={menu} />
      <Sidebar setMenu={setMenu} menu={menu} />
      {/* Main content column */}
      <div className="pt-14 pr-2 md:pl-58 md:flex-row flex-1">
        <ProfileInfo data={data} profile={true} />
        <ProfileContent userPosts={userPosts} data={data} />
      </div>
      <MobileNav />
    </div>
  );
}
