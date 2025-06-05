"use client";
import React, { useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MessageSquareText,
  ThumbsUp,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import getTimeAgo from "../../lib/utils/getTimeAgo";

const ImageView = ({ post, image }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const router = useRouter();
  const touchStartX = useRef(null);

  // Mock data for the post
  // const post = {
  //   images: [
  //     "https://dl.dropboxusercontent.com/scl/fi/4qv627c5fvptroyr7bhjy/1748317230651-Color.png?rlkey=675fz70g868vfpsv33nqmk0oe",
  //     "https://dl.dropboxusercontent.com/scl/fi/f4qqkfu56d0fy8g8bo87b/1747579541512-IMG20250518171956.jpg?rlkey=zrrk0n9s4zxy4wdob4d2ds8li",
  //     "https://dl.dropboxusercontent.com/scl/fi/n6alx5qaec22dc5iuad8m/1747579673851-IMG20250515091650.jpg?rlkey=rcg8g1jlb35ngdq49s7mt6txc",
  //     "https://dl.dropboxusercontent.com/scl/fi/1ywi0f9ffce729n1a03k6/1747580537744-1000032612.jpg?rlkey=2jyw4b4wezwq6ms9vlrvnhvyn",
  //   ],
  //   likes: 3700,
  //   shares: 1200,
  // };

  const comments = [
    {
      id: 1,
      username: "Username",
      timeAgo: "4 days ago",
      text: "ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicab ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicaab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explica",
      likes: 0,
      replies: [],
    },
    {
      id: 2,
      username: "Username",
      timeAgo: "4 days ago",
      text: "ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explica",
      likes: 3700,
      replies: [
        {
          id: 21,
          username: "User123",
          timeAgo: "3 days ago",
          text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem a",
          likes: 2100,
        },
      ],
    },
    {
      id: 3,
      username: "JaneDoe",
      timeAgo: "2 days ago",
      text: "At vero eos et accusamus et iusto odio dignissimos ducimus",
      likes: 1800,
      replies: [],
    },
    {
      id: 4,
      username: "TechGuru",
      timeAgo: "1 day ago",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      likes: 950,
      replies: [
        {
          id: 41,
          username: "DevExpert",
          timeAgo: "1 day ago",
          text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
          likes: 340,
        },
        {
          id: 42,
          username: "CodeMaster",
          timeAgo: "1 day ago",
          text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum",
          likes: 180,
        },
      ],
    },
    {
      id: 5,
      username: "DesignPro",
      timeAgo: "12 hours ago",
      text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      likes: 670,
      replies: [],
    },
    {
      id: 6,
      username: "PhotoLover",
      timeAgo: "8 hours ago",
      text: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
      likes: 420,
      replies: [
        {
          id: 61,
          username: "ArtFan",
          timeAgo: "7 hours ago",
          text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
          likes: 89,
        },
      ],
    },
    {
      id: 7,
      username: "CreativeMind",
      timeAgo: "6 hours ago",
      text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
      likes: 1200,
      replies: [],
    },
    {
      id: 8,
      username: "InnovateTech",
      timeAgo: "4 hours ago",
      text: "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt",
      likes: 890,
      replies: [
        {
          id: 81,
          username: "FutureCoder",
          timeAgo: "3 hours ago",
          text: "Explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur",
          likes: 234,
        },
        {
          id: 82,
          username: "NextGenDev",
          timeAgo: "2 hours ago",
          text: "Aut odit aut fugit, sed quia consequuntur magni dolores eos",
          likes: 156,
        },
      ],
    },
    {
      id: 9,
      username: "VisualArtist",
      timeAgo: "2 hours ago",
      text: "Qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet",
      likes: 567,
      replies: [],
    },
    {
      id: 10,
      username: "DigitalNomad",
      timeAgo: "1 hour ago",
      text: "Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam",
      likes: 345,
      replies: [],
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.url.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + post.url.length) % post.url.length
    );
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0) {
        nextImage(); // Swipe left
      } else {
        prevImage(); // Swipe right
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="flex-1 flex pt-8 flex-col md:flex-row h-full md:max-w-screen  w-screen overflow-hidden">
      {/* Desktop layout */}
      <div className="flex flex-col lg:flex-row bg-white rounded-lg overflow-y-scroll lg:overflow-hidden h-[calc(100vh-112px)] md:h-[calc(100vh-56px)] w-full">
        {/* Left side - Image carousel */}
        <div
          className="relative flex-1 bg-gray-200 min-h-[calc(100vh-112px)] flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {!image && (
            <button
              onClick={prevImage}
              className="absolute left-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <img
            src={post.url[currentImageIndex]}
            alt="Post content"
            className="w-full h-full object-contain"
          />

          {!image && (
            <button
              onClick={nextImage}
              className="absolute right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {post.url.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
          >
            <span className="w-5 h-5 flex items-center justify-center text-lg font-semibold">
              <X className="w-5 h-5" />
            </span>
          </button>
        </div>

        {/* Right side - Comments */}
        <div className="lg:w-3/10 flex flex-col">
          {/* Comments header */}
          <div className="p-4 border-b border-gray-200 flex gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0">
              <img
                src={post?.user?.profile_img_url}
                alt="User avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {post.user?.username}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {getTimeAgo(post.created_at)}
                  </span>
                </div>
                <button className="ml-auto">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <h2 className="text-sm font-semibold text-gray-700 mt-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-700 mb-2">{post.description}</p>
            </div>
          </div>

          {/* Scrollable comments list */}
          <div className="flex-1 overflow-y-auto order-3 lg:order-2">
            <div className="p-4 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* Main comment */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.username}
                        </span>
                        <span className="text-gray-500 text-xs">•</span>
                        <span className="text-gray-500 text-xs">
                          {comment.timeAgo}
                        </span>
                        <button className="ml-auto">
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                          <Heart className="w-4 h-4" />
                          {comment.likes > 0 && formatNumber(comment.likes)}
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          Reply
                        </button>
                        {comment.replies.length > 0 && (
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                          >
                            <span>↓</span>
                            {comment.replies.length} Replies
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {showReplies[comment.id] &&
                    comment.replies.map((reply) => (
                      <div key={reply.id} className="ml-8 flex gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {reply.username}
                            </span>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-gray-500 text-xs">
                              {reply.timeAgo}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {reply.text}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                              <Heart className="w-4 h-4" />
                              {formatNumber(reply.likes)}
                            </button>
                            <button className="text-gray-500 hover:text-gray-700">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons and comment input */}
          <div className="p-4 border-t border-gray-200 w-full h-fit order-2 lg:order-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-1 ${
                    isLiked
                      ? "text-red-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <ThumbsUp
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  {formatNumber(post.likes_count)}
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <Share className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center gap-1 ${
                    isSaved
                      ? "text-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                  />
                  Save
                </button>
              </div>
            </div>

            {/* Comment input */}
            <div className="flex gap-3 items-center py-3 px-4 bg-gray-100 rounded-xl mt-2">
              <img
                src={post?.user?.profile_img_url} // Replace with user's avatar if available
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <textarea
                placeholder="Write a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
                className="flex-1 bg-gray-100 border-none outline-none resize-none text-sm px-3 py-2 placeholder-gray-500 no-scrollbar"
                style={{ minHeight: 40 }}
              />
              <button
                disabled={!newComment.trim()}
                className="bg-teal-500 text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{ minWidth: 90 }}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageView;
