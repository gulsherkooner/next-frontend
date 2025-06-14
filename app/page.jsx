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
import { fetchUserData } from "./features/auth/authSlice";

export default function Home() {
  const isMobile = useIsMobile();
  const [menu, setMenu] = useState(false);
  const { posts, status, error, page, totalPages } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const sentinelRef = useRef(null);

  // Generate a seed once per session/feed
  const [seed] = useState(() => Math.random().toString(36).slice(2));

  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(fetchPublicPosts({ page: 1, limit: 2, seed }));
  }, [dispatch, seed]);

  useEffect(() => {
    if (user?.user_id) dispatch(fetchUserPosts(user?.user_id));
  }, [user?.user_id, dispatch]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (status === "loading" || isFetchingNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          page < totalPages &&
          !isFetchingNext
        ) {
          setIsFetchingNext(true);
          dispatch(fetchPublicPosts({ page: page + 1, limit: 2, seed }))
            .finally(() => setIsFetchingNext(false));
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

  // Sample posts data
  // const posts = [
  //   {
  //     id: 1,
  //     username: "Username",
  //     timeAgo: "1d ago",
  //     content:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu faucibus mattis nullam dignissim, metus non feugiat accumsan, nulla sem mattis lit etiam...",
  //     imageUrl:
  //       "https://www.postplanner.com/hubfs/what-to-post-on-instagram.png",
  //     likes: 12000,
  //   },
  //   {
  //     id: 2,
  //     username: "Username",
  //     timeAgo: "1d ago",
  //     content:
  //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu faucibus mattis nullam dignissim, metus non feugiat accumsan, nulla sem mattis lit etiam...",
  //     likes: 12000,
  //   },
  //   {
  //     id: 3,
  //     username: "Username",
  //     timeAgo: "1d ago",
  //     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
  //     videoUrl: "https://cdn.pixabay.com/video/2025/03/29/268528_large.mp4",
  //     likes: 12000,
  //     views: 126000,
  //   },
  // ];

    // const state = useSelector((state) => state)
    // console.log("state:", state);

  return (
    <div className="bg-gray-100 min-h-screen pb-14 md:pb-0 w-full">
      <Header setMenu={setMenu} menu={menu} />
      <Sidebar setMenu={setMenu} menu={menu} />

        <div className="pt-14 md:pl-56 flex md:flex-row">
          {/* Main content column */}
          <div className="flex-1 max-w-full md:max-w-xl xl:max-w-2xl 2xl:max-w-2xl mx-auto p-2 sm:p-4">
            <StoryBar />
            <CreatePost />

            <ReelCarousel />

            {status === "loading" && <div>Loading...</div>}
            {posts.map((post) => (
              <Post key={post.post_id} {...post} />
            ))}
            <div ref={sentinelRef} style={{ height: 1 }} />
            {isFetchingNext && <div>Loading more...</div>}

            <SponsoredProducts />

            <SponsoredBrand />
          </div>

          {/* Right sidebar - only visible on larger screens */}
          {!isMobile && (
            <div className="hidden lg:block w-80 p-4"> 
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
