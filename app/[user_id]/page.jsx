"use client";
import React from "react";
import { useParams } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProfileInfo from "../components/profileComponents/ProfileInfo";
import ProfileContent from "../components/profileComponents/ProfileContent";
import MobileNav from "../components/MobileNav";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserData } from "../features/auth/authSlice";

const UserProfile = () => {
  const params = useParams();
  const { user_id } = params;
  const dispatch = useDispatch();

  const [menu, setMenu] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    dispatch(fetchUserData(user_id));
    const fetchUser = async () => {
      try {
        const apiGatewayUrl =
          process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
        const res = await fetch(`${apiGatewayUrl}/auth/user/${user_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setData(data?.user);
      } catch (error) {
        console.error("no user data found:", error);
      }
    };
    fetchUser();
  }, []);

  const { userPosts } = useSelector((state) => state.posts);

  return (
    <div className="bg-gray-100 min-h-screen pb-14 md:pb-0 w-full">
      <Header setMenu={setMenu} menu={menu} />
      <Sidebar setMenu={setMenu} menu={menu} />
      {/* Main content column */}
      <div className="pt-14 pr-2 md:pl-58 md:flex-row flex-1">
        <ProfileInfo data={data} profile={false} />
        <ProfileContent userPosts={userPosts} />
      </div>
      <MobileNav />
    </div>
  );
};

export default UserProfile;
