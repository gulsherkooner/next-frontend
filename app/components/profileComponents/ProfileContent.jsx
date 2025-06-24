"use client";
import React, { useEffect, useState } from "react";
import TabNavigation from "./TabNavigation";
import PostsGrid from "./PostsGrid";
import ReelsGrid from "./ReelsGrid";
import VideosGrid from "./VideosGrid";
import CollectionsGrid from "./CollectionsGrid";
import AboutTab from "./AboutTab";

const ProfileContent = ({ userPosts, data }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [imgPosts, setImgPosts] = useState(null);
  const [videoPosts, setVideoPosts] = useState(null);
  const [reelPosts, setReelPosts] = useState(null);

  // Update the filtering logic to avoid too many re-renders
  useEffect(() => {
    if (userPosts) {
      const img = userPosts.filter((post) => post.post_type === "image");
      const video = userPosts.filter(
        (post) => post.post_type === "video" && post.is_reel === false
      );
      const reel = userPosts.filter(
        (post) => post.post_type === "video" && post.is_reel === true
      );

      setImgPosts(img);
      setVideoPosts(video);
      setReelPosts(reel);
    }
  }, [userPosts]); // Dependency array ensures this runs only when userPosts changes

  const renderTabContent = () => {
    switch (activeTab) {
      case "posts":
        return <PostsGrid imgPosts={imgPosts} />;
      case "reels":
        return <ReelsGrid reelPosts={reelPosts} />;
      case "videos":
        return <VideosGrid videoPosts={videoPosts} />;
      case "collections":
        return <CollectionsGrid />;
      case "account":
        return <AboutTab data={data} />;
      default:
        return <PostsGrid />;
    }
  };

  return (
    <div>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderTabContent()}
    </div>
  );
};

export default ProfileContent;
