"use client";
import React, { useEffect, useRef, useState } from "react";
import { Pin } from "lucide-react";
import { motion } from "framer-motion";
import { getCookie } from "../../lib/utils/cookie";

const PhotoGallery = ({ posts = [] }) => {
  const [showImage, setShowImage] = useState(null);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [showPinFor, setShowPinFor] = useState(null);
  const [localPosts, setLocalPosts] = useState([]);
  const longPressTimeout = useRef(null);
  const token = getCookie("accessToken");

  useEffect(() => {
    const initiallyPinned = posts?.filter((p) => p.ispinned).map((p) => p._id);
    setPinnedPosts(initiallyPinned);
    setLocalPosts(posts);
  }, [posts]);

  const togglePin = async (postId) => {
    const isCurrentlyPinned = pinnedPosts.includes(postId);
    const newPinState = !isCurrentlyPinned;

    setPinnedPosts((prev) =>
      isCurrentlyPinned
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
    setShowPinFor(null);

    setLocalPosts((prev) =>
      prev.map((post) =>
        post._id === postId ? { ...post, ispinned: newPinState } : post
      )
    );

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/dating-posts/pin-post/${postId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ispinned: newPinState }),
        }
      );
    } catch (err) {
      console.error("Failed to update pin:", err);
    }
  };

  const getImageUrl = (imagePath) => {
    if (imagePath.includes("dropbox.com")) {
      return imagePath
        .replace("www.dropbox.com", "dl.dropboxusercontent.com")
        .split("?")[0];
    }
    return imagePath;
  };

  const handleMouseDown = (postId) => {
    longPressTimeout.current = setTimeout(() => {
      setShowPinFor(postId);
    }, 600);
  };

  const handleMouseUp = () => {
    clearTimeout(longPressTimeout.current);
  };

  const sortedPosts = [...localPosts].sort((a, b) => {
    if (a.ispinned === b.ispinned) return 0;
    return a.ispinned ? -1 : 1;
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {sortedPosts.map((post, i) => {
        const postId = post._id || i;
        const isPinned = post.ispinned;

        return (
          <div
            key={i}
            className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden"
            onMouseDown={() => handleMouseDown(postId)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown(postId)}
            onTouchEnd={handleMouseUp}
          >
            <img
              src={getImageUrl(post.image)}
              alt={post.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setShowImage(post)}
            />

            {isPinned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="absolute top-4 right-4 z-10"
              >
                <Pin className="w-5 h-5 rotate-45 text-gray-800 fill-black" />
              </motion.div>
            )}

            {showPinFor === postId && (
              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(postId);
                }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="bg-white text-black rounded-full px-4 py-2 shadow-lg font-semibold"
                >
                  {isPinned ? "Unpin" : "Pin"}
                </motion.div>
              </div>
            )}
          </div>
        );
      })}

      {showImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => setShowImage(null)}
        >
          <div className="animate-pop rounded-xl shadow-2xl p-2 bg-white/5">
            <img
              src={getImageUrl(showImage.image)}
              alt={showImage.name || "Full Post"}
              className="max-w-[70vw] max-h-[70vh] rounded-lg object-contain pointer-events-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;