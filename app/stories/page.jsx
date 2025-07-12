"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import Stories from "../components/storiesComponents/Stories";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateAccessToken } from "../features/auth/authSlice";
import { getCookie } from "../lib/utils/cookie";
import { getFollowing } from "../features/sub/subslice";
import { useRouter } from "next/navigation";
import { fetchStoriesByUser } from "../features/stories/storiesslice"; // Make sure this import exists

export default function StoriesPage() {
  const [menu, setMenu] = useState(false);
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const data = useSelector((state) => state.auth?.user);
  const router = useRouter();
  const [storiesArray, setStoriesArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = getCookie("accessToken");
      if (!accessToken) {
        const refreshToken = getCookie("refreshToken");
        if (!refreshToken) {
          router.push("/login");
          return;
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
  }, [dispatch, router]);

  useEffect(() => {
    if (data?.user_id) {
      dispatch(getFollowing(data.user_id))
        .unwrap()
        .then(async (followingResult) => {
          // 2. Fetch my stories first
          const myStories = await dispatch(fetchStoriesByUser(data.user_id)).unwrap();

          // 3. Fetch stories for each following user
          const followingUserIds = (followingResult || [])
            .map((f) => f.target_userid)
            .filter(Boolean);

          const followingStories = await Promise.all(
            followingUserIds.map((uid) =>
              dispatch(fetchStoriesByUser(uid)).unwrap().catch(() => [])
            )
          );

          // 4. Combine: only append if stories exist
          const storiesArr = [];
          if (myStories && myStories.length > 0) {
            storiesArr.push({ user_id: data.user_id, stories: myStories });
          }
          followingUserIds.forEach((uid, idx) => {
            if (followingStories[idx] && followingStories[idx].length > 0) {
              storiesArr.push({ user_id: uid, stories: followingStories[idx] });
            }
          });
          setStoriesArray(storiesArr);
        })
        .catch((err) => {
          console.error("Error fetching following or stories:", err);
        });
    }
  }, [data?.user_id, dispatch]);


  return (
    <div className="bg-gray-100 min-h-auto pb-0 w-full">
      <Header setMenu={setMenu} menu={menu} />
      <div className="pt-14 flex flex-col items-center justify-start w-full h-screen pb-14 md:pb-0 ">
        {/* Pass storiesArray to Stories if needed */}
        <Stories storiesArray={storiesArray} self={data?.user_id} data={data} />
      </div>
      <MobileNav />
    </div>
  );
}
