"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ProfileInfo from "../components/profileComponents/ProfileInfo";
import ProfileContent from "../components/profileComponents/ProfileContent";
import MobileNav from "../components/MobileNav";
import { checkFollowUser } from "../features/sub/subslice";
import { getCookie } from "../lib/utils/cookie";

const UserProfile = () => {
  const { user_id } = useParams();
  const dispatch = useDispatch();
  const [menu, setMenu] = useState(false);
  const [data, setData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts"); // ✅ Add this
  const [datingProfile, setDatingProfile] = useState(null);
  const [datingPosts, setDatingPosts] = useState([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const apiGatewayUrl =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";

  // Fetch user data and posts
  const fetchData = async (user_id) => {
    try {
      const fetchUserRes = await fetch(
        `${apiGatewayUrl}/auth/user/${user_id}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      const fetchPostRes = await fetch(
        `${apiGatewayUrl}/posts/user/public/${user_id}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!fetchUserRes.ok) throw new Error("Failed to fetch user data.");
      if (!fetchPostRes.ok) throw new Error("Failed to fetch user posts.");

      const userData = await fetchUserRes.json();
      const postsData = await fetchPostRes.json();

      setData(userData?.user);
      setUserPosts(postsData?.posts);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // Use effect for initial data fetching
  useEffect(() => {
    fetchData(user_id);
  }, [user_id, apiGatewayUrl]);

  useEffect(() => {
      const fetchDatingProfile = async () => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/dating-profile/${user_id}`
        );
        const profileData = await res.json();
        setDatingProfile(profileData);
      };
  
      const fetchDatingPosts = async () => {
        const token = getCookie("accessToken");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/dating-posts/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const postData = await res.json();
        setDatingPosts(postData);
      };
  
      if (user_id) {
        fetchDatingProfile();
        fetchDatingPosts();
      }
    }, [user_id]);

  // Use effect for checking follow status
  useEffect(() => {
    const fetchFollow = async () => {
      const follow = await dispatch(checkFollowUser(user_id));
      setIsFollowing(follow?.payload?.isFollowing);
    };
    fetchFollow();
  }, [user_id, dispatch]);

  return (
    <div className="bg-gray-100 min-h-screen pb-14 md:pb-0 w-full">
      <Header setMenu={setMenu} menu={menu} />
      <Sidebar setMenu={setMenu} menu={menu} />
      {/* Main content column */}
      <div className="pt-14 pr-2 md:pl-58 md:flex-row flex-1">
        <ProfileInfo
          data={data}
          profile={false}
          isFollowing={isFollowing}
          setIsFollowing={setIsFollowing}
          fetchData={fetchData} // Now `fetchData` is properly passed
          activeTab={activeTab} // ✅ pass current tab
          onAddPhotoClick={() => setShowPostModal(true)} // ✅ trigger modal
        />
        <ProfileContent
          userPosts={userPosts}
          datingProfile={datingProfile}
          datingPosts={datingPosts}
          activeTab={activeTab} // ✅ pass down
          setActiveTab={setActiveTab} // ✅ pass setter
          showPostModal={showPostModal}
          setShowPostModal={setShowPostModal}
          data={data}
        />
      </div>
      <MobileNav />
    </div>
  );
};

export default UserProfile;
