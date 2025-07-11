"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CreatePost from "./components/postComponents/CreatePost";
import Post from "./components/postComponents/Post";
import ProfileSuggestion from "./components/ProfileSuggestion";
import ReelCarousel from "./components/ReelCarousel";
import SponsoredProducts from "./components/SponsoredProducts";
import SponsoredBrand from "./components/SponsoredBrand";
import MobileNav from "./components/MobileNav";
import { useIsMobile } from "../app/hooks/use-mobile";
import StoryBar from "./components/StoryBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicPosts, fetchUserPosts } from "./features/posts/postsSlice";
import ProfileInfo from "./components/profileComponents/ProfileInfo";
import ProfileContent from "./components/profileComponents/ProfileContent";
import { fetchUserData, updateAccessToken } from "./features/auth/authSlice";
import { getCookie } from "./lib/utils/cookie";
import { useRouter } from "next/navigation";

export default function Home() {
  const isMobile = useIsMobile();
  const [menu, setMenu] = useState(false);
  const { posts, status, error, page, totalPages } = useSelector(
    (state) => state.posts
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const sentinelRef = useRef(null);
  const router = useRouter();

  // Generate a seed once per session/feed
  const [seed] = useState(() => Math.random().toString(36).slice(2));

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
    if (posts.length === 0) {
      dispatch(fetchUserData());
      dispatch(fetchPublicPosts({ page: 1, limit: 5, seed }));
    }
  }, [dispatch, seed, posts.length]);

  useEffect(() => {
    if (user?.user_id) dispatch(fetchUserPosts(user?.user_id));
  }, [user?.user_id, dispatch]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (status === "loading" || isFetchingNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !isFetchingNext) {
          setIsFetchingNext(true);
          dispatch(
            fetchPublicPosts({ page: page + 1, limit: 5, seed })
          ).finally(() => setIsFetchingNext(false));
        }
      },
      { threshold: 1 }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [sentinelRef, page, totalPages, dispatch, status, isFetchingNext, seed]);

  // Sample data for trending profiles
  const trendingProfiles = [
    { username: "Username 1", followers: "21k" },
    { username: "Username 2", followers: "153k" },
    { username: "Username 3", followers: "19k" },
    { username: "Username 4", followers: "64k" },
  ];

  // Sample data for suggested profiles
  const suggestedProfiles = [
    { username: "Username 1", followers: "23k" },
    { username: "Username 2", followers: "16k" },
    { username: "Username 3", followers: "53k" },
    { username: "Username 4", followers: "237k" },
    { username: "Username 5", followers: "432k" },
    { username: "Username 6", followers: "121k" },
  ];

  // const state = useSelector((state) => state)
  // console.log("state:", state);

  return (
    <div
      className="bg-white min-h-screen pb-14 md:pb-0 w-full scroll-smooth"
      style={{ scrollBehavior: "auto" }}
    >
      <Header setMenu={setMenu} menu={menu} />
      <Sidebar setMenu={setMenu} menu={menu} />

      <div className="pt-14 md:pl-56 flex md:flex-row scroll-smooth">
        {/* Main content column */}
        <div
          className="flex-1 max-w-full md:max-w-xl xl:max-w-xl 2xl:max-w-2xl mx-auto py-2 md:px-2 sm:py-4 scroll-smooth"
          id="main-feed"
        >
          <StoryBar />
          <CreatePost />

          <ReelCarousel />

          {status === "loading" && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}

          <div className="space-y-4 scroll-smooth">
            {posts.map((post) => (
              <Post key={post.post_id} {...post} />
            ))}
          </div>

          <div ref={sentinelRef} style={{ height: 1 }} />

          {isFetchingNext && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading more...</span>
            </div>
          )}

          <SponsoredProducts />

          <SponsoredBrand />
        </div>

        {/* Right sidebar - only visible on larger screens */}
        {!isMobile && (
          <div className="hidden lg:block w-80 p-4 scroll-smooth">
            <ProfileSuggestion
              title="Trending Profiles"
              profiles={trendingProfiles}
            />

            <ProfileSuggestion
              title="Suggested for you"
              profiles={suggestedProfiles}
            />
          </div>
        )}
      </div>
      <MobileNav />
    </div>
  );
}
