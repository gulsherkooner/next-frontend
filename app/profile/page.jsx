"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProfileInfo from "../components/profileComponents/ProfileInfo";
import ProfileContent from "../components/profileComponents/ProfileContent";
import { useIsMobile } from "../hooks/use-mobile";
import MobileNav from "../components/MobileNav";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateAccessToken } from "../features/auth/authSlice";
import { fetchUserPosts } from "../features/posts/postsSlice";
import { getCookie } from "../lib/utils/cookie";
import { useRouter } from "next/navigation";

export default function profile() {
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // ✅ Add this
  const [datingProfile, setDatingProfile] = useState(null);
  const [datingPosts, setDatingPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { userPosts } = useSelector((state) => state.posts);
  const data = useSelector((state) => state.auth?.user);

  useEffect(() => {
    const fetchDatingProfile = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/dating-profile/${data?.user_id}`);
      const profileData = await res.json();
      setDatingProfile(profileData);
    };

    const fetchDatingPosts = async () => {
      const token = getCookie("accessToken");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/dating-posts/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const postData = await res.json();
      setDatingPosts(postData);
    };

    if (data?.user_id) {
      fetchDatingProfile();
      fetchDatingPosts();
    }
  }, [data?.user_id]);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = getCookie("accessToken");

      if (!accessToken) {
        const refreshToken = getCookie("refreshToken");

        if (!refreshToken) {
          console.log("No refresh token found, redirecting to login");
          router.push("/login");
          return;
        }

        try {
          const apiGatewayUrl =
            process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";

          console.log("Attempting to refresh token...");

          const res = await fetch(`${apiGatewayUrl}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
            credentials: "include",
          });


          if (!res.ok) {
            const errorText = await res.text();
            console.error("Refresh failed:", errorText);
            router.push("/login");
            return;
          }

          const data = await res.json();

          // Update Redux store - this will also set cookies via the reducer
          dispatch(
            updateAccessToken({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            })
          );

          // Fetch user data with new token
          dispatch(fetchUserData());
        } catch (err) {
          console.error("Refresh error:", err);
          router.push("/login");
        }
      } else {
        // We have an access token, fetch user data
        dispatch(fetchUserData());
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    data?.user_id && dispatch(fetchUserPosts(data?.user_id));
  }, [data?.user_id]);

  return (
    <div className="bg-gray-100 min-h-screen pb-14 md:pb-0 w-full">
      <Header setMenu={setMenu} menu={menu} />
      <Sidebar setMenu={setMenu} menu={menu} />

      <div className="pt-14 pr-2 md:pl-58 md:flex-row flex-1">
        <ProfileInfo data={data} profile={true} />
        <ProfileContent userPosts={userPosts} data={data} />
      </div>

      <MobileNav />
    </div>
  );
}
