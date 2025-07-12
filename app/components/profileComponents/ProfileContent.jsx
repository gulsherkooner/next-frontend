"use client";
import React, { useEffect, useState } from "react";
import TabNavigation from "./TabNavigation";
import PostsGrid from "./PostsGrid";
import ReelsGrid from "./ReelsGrid";
import VideosGrid from "./VideosGrid";
import CollectionsGrid from "./CollectionsGrid";
import AboutTab from "./AboutTab";
import DatingTab from "./DatingTab"; // Import the new DatingTab component
import DatingProfileContent from "../datingComponents/DatingProfileContent";
import { AnimatePresence, motion } from "framer-motion";

const ProfileContent = ({
  userPosts,
  datingProfile,
  datingPosts,
  activeTab,
  setActiveTab,
  showPostModal,
  setShowPostModal,
  data,
}) => {
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
      case "dating":
        return (
          <DatingProfileContent
            profile={datingProfile}
            posts={datingPosts}
            showPostModal={showPostModal}
            setShowPostModal={setShowPostModal}
          />
        ); // Render the DatingTab component
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
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={["posts", "reels", "videos", "collections", "account", "dating"]}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProfileContent;
