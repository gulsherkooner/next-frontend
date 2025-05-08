"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CreatePost from "./components/CreatePost";
import Post from "./components/Post";
import ProfileSuggestion from "./components/ProfileSuggestion";
import ReelCarousel from "./components/ReelCarousel";
import SponsoredProducts from "./components/SponsoredProducts";
import SponsoredBrand from "./components/SponsoredBrand";
import MobileNav from "./components/MobileNav";
import { useIsMobile } from "../app/hooks/use-mobile";
import StoryBar from "./components/StoryBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicPosts } from "./features/posts/postsSlice";

export default function Home() {
  const isMobile = useIsMobile();
  const [menu, setMenu] = useState(false);
  const { posts, status, error } = useSelector(state => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPublicPosts());
  }, [dispatch]);

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

  return (
    <div className="bg-gray-100 min-h-screen pb-14 md:pb-0 w-full">
      <Header setMenu = {setMenu} menu={menu} />
      <Sidebar setMenu = {setMenu} menu={menu} />

      <div className="pt-16 md:pl-56 flex md:flex-row">
        {/* Main content column */}
        <div className="flex-1 max-w-full md:max-w-xl xl:max-w-2xl 2xl:max-w-2xl mx-auto p-2 sm:p-4">
          <StoryBar />
          <CreatePost />

          <ReelCarousel />

          {status === "loading" ? <div>Loading...</div>}
          {posts.map((post) => (
            <Post key={post.post_id} {...post} />
          ))}

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
