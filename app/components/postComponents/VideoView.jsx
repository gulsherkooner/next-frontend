"use client";
import React, { useState, useRef, useEffect } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import getTimeAgo from "../../lib/utils/getTimeAgo";

const VideoView = ({ post }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const hideControlsTimeout = useRef(null);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const self = useSelector((state) => state.auth?.user);

  const comments = [
    {
      id: 1,
      username: "TechExplorer",
      text: "This tutorial really helped me understand the concept! The explanation was clear and easy to follow.",
      likes: 127,
      time: "2 days ago",
      replies: 8,
    },
    {
      id: 2,
      username: "CodeMaster99",
      text: "Great content as always! Could you make a follow-up video covering advanced techniques?",
      likes: 89,
      time: "1 day ago",
      replies: 3,
    },
    {
      id: 3,
      username: "LearnWithMe",
      text: "Thank you for sharing this knowledge. It saved me hours of research!",
      likes: 45,
      time: "18 hours ago",
      replies: 1,
    },
  ];

  const suggestedVideos = [
    {
      id: 1,
      title: "React Hooks Complete Tutorial - Learn useState, useEffect & More",
      username: "WebDevMaster",
      views: "245k views",
      time: "3 days ago",
      duration: "15:42",
    },
    {
      id: 2,
      title: "JavaScript ES6+ Features Every Developer Should Know",
      username: "CodeAcademy",
      views: "189k views",
      time: "1 week ago",
      duration: "22:18",
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox - When to Use Which Layout Method",
      username: "DesignGuru",
      views: "156k views",
      time: "4 days ago",
      duration: "18:35",
    },
    {
      id: 4,
      title: "Building a Full Stack App with React and Node.js",
      username: "FullStackDev",
      views: "321k views",
      time: "2 weeks ago",
      duration: "45:12",
    },
    {
      id: 5,
      title: "Advanced TypeScript Tips and Tricks for Better Code",
      username: "TypeScriptPro",
      views: "98k views",
      time: "5 days ago",
      duration: "28:47",
    },
  ];

  const suggestedReels = [
    {
      id: 1,
      title: "Quick CSS Tip #1",
      username: "CSSNinja",
      views: "50k",
      thumbnail: "reel-1",
    },
    {
      id: 2,
      title: "JavaScript in 60s",
      username: "JSQuick",
      views: "75k",
      thumbnail: "reel-2",
    },
    {
      id: 3,
      title: "React Hook Secret",
      username: "ReactTips",
      views: "120k",
      thumbnail: "reel-3",
    },
    {
      id: 4,
      title: "Debug Like Pro",
      username: "DevHacks",
      views: "85k",
      thumbnail: "reel-4",
    },
    {
      id: 5,
      title: "Git Commands",
      username: "GitGuru",
      views: "95k",
      thumbnail: "reel-5",
    },
    {
      id: 6,
      title: "API Best Practices",
      username: "BackendBoss",
      views: "110k",
      thumbnail: "reel-6",
    },
  ];

  // Play/pause logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    isPlaying ? video.play() : video.pause();
  }, [isPlaying]);

  // Volume/mute logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.volume = volume;
  }, [isMuted, volume]);

  // Update current time and duration
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  // Format time helper
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Seek bar logic
  const handleSeek = (e) => {
    const bar = e.target;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Play/pause button
  const handlePlayPause = () => setIsPlaying((p) => !p);

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        username: "You",
        text: newComment,
        likes: 0,
        time: "just now",
        replies: 0,
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  // Fullscreen logic
  const handleFullscreen = () => {
    const container = videoContainerRef.current;
    if (!container) return;
    if (
      document.fullscreenElement === container ||
      document.webkitFullscreenElement === container
    ) {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    } else {
      container.requestFullscreen?.() || container.webkitRequestFullscreen?.();
    }
  };

  // Volume bar logic
  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);
    setVolume(value);
    setIsMuted(value === 0);
  };

  const handleMute = () => {
    setIsMuted((m) => !m);
    if (volume === 0) setVolume(0.5); // Unmute to mid volume if muted at 0
  };

  // Auto-hide controls logic
  useEffect(() => {
    if (!showControls) return;
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => setShowControls(false), 5000);
    return () => clearTimeout(hideControlsTimeout.current);
  }, [showControls, isPlaying, currentTime, volume, isMuted]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  return (
    <div className="pt-7 min-h-screen bg-white">
      <div className="w-full max-w-screen px-4 py-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Video Player */}
            <div
              className="relative bg-black rounded-sm overflow-hidden mb-4 flex items-center justify-center aspect-video"
              ref={videoContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setShowControls(false)}
              tabIndex={0}
            >
              <div className="w-full h-full flex items-center justify-center relative">
                <video
                  ref={videoRef}
                  src={post.url[0]}
                  preload="metadata"
                  className="w-full h-full object-contain"
                  onClick={() => setIsPlaying((p) => !p)}
                  tabIndex={0}
                  style={{ background: "#000" }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                {/* Center Play/Pause Button */}
                {showControls && (
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause size={32} className="text-black" />
                    ) : (
                      <Play size={32} className="text-black" />
                    )}
                  </button>
                )}
              </div>
              {/* Video Controls */}
              <div
                className={`absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                  showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onMouseMove={handleMouseMove}
              >
                {/* Progress Bar */}
                <div
                  className="relative w-full h-2 bg-gray-700 rounded cursor-pointer group mb-2"
                  onClick={handleSeek}
                  style={{ touchAction: "none" }}
                >
                  <div
                    className="absolute top-0 left-0 h-2 bg-red-500 rounded"
                    style={{
                      width: duration
                        ? `${(currentTime / duration) * 100}%`
                        : "0%",
                      transition: "width 0.1s linear",
                    }}
                  />
                  {/* Thumb */}
                  <div
                    className="absolute top-1/2"
                    style={{
                      left: duration
                        ? `calc(${(currentTime / duration) * 100}% - 8px)`
                        : "-8px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <div className="w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow group-hover:scale-110 transition-transform"></div>
                  </div>
                </div>
                {/* Controls Row */}
                <div className="flex items-center gap-4 text-white">
                  {/* Play/Pause */}
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="p-2 hover:bg-white/10 rounded-full"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause size={22} className="text-white" />
                    ) : (
                      <Play size={22} className="text-white" />
                    )}
                  </button>
                  {/* Time */}
                  <span className="text-xs w-20 text-left font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMute}
                      className="p-2 hover:bg-white/10 rounded-full"
                      aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={20} className="text-white" />
                      ) : (
                        <Volume2 size={20} className="text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-1 accent-red-500"
                    />
                  </div>
                  {/* Spacer */}
                  <div className="flex-1" />
                  {/* Fullscreen */}
                  <button
                    onClick={handleFullscreen}
                    className="p-2 hover:bg-white/10 rounded-full"
                    aria-label="Fullscreen"
                  >
                    <Maximize2 size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Title */}
            <h1 className="text-xl font-bold mb-4">
              {post.title ||
                "React Tutorial for Beginners - Learn React in 1 Hour"}
            </h1>

            {/* Video Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  <img
                    src={post.user?.profile_img_url}
                    className="rounded-full object-center object-contain"
                    alt=""
                  />
                </div>
                <div>
                  <div className="font-semibold">{post.user?.username}</div>
                  <div className="text-sm text-gray-600">2.4M Subscribers</div>
                </div>
                <button
                  onClick={handleSubscribe}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    isSubscribed
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                  <button className="px-4 py-2 hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    {post.likes_count || 0}
                  </button>
                </div>

                <button className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share
                </button>

                <button className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  Save
                </button>
              </div>
            </div>

            {/* Video Stats */}
            <div className="text-sm text-gray-600 mb-4">
              1.2M views • {getTimeAgo(post.created_at)}
            </div>

            {/* Video Description */}
            <div className="text-sm text-gray-700 mb-8 leading-relaxed">
              {post.description}
            </div>

            {/* Comments Section  */}
            <div className=" hidden lg:block border-t pt-6 order-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {comments.length} Comments
                </h3>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sort by
                </button>
              </div>

              {/* Comment Input */}
              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  <img
                    src={self?.profile_img_url}
                    className="rounded-full object-center object-contain"
                    alt=""
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border-b-2 border-gray-200 focus:border-gray-400 outline-none resize-none"
                    rows="1"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => setNewComment("")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {comment.username.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          • {comment.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          <span className="text-xs">{comment.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                          Share
                        </button>

                        <button className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Desktop only, moves to bottom on mobile */}
          <div className={`w-full lg:w-96  order-last mt-0`}>
            <div className="flex gap-4 mb-4 border-b overflow-x-auto">
              <button className="pb-2 border-b-2 border-black font-medium whitespace-nowrap">
                All
              </button>
              <button className="pb-2 text-gray-600 hover:text-gray-800 whitespace-nowrap">
                Related
              </button>
              <button className="pb-2 text-gray-600 hover:text-gray-800 whitespace-nowrap">
                For you
              </button>
              <button className="pb-2 text-gray-600 hover:text-gray-800 whitespace-nowrap">
                Watched
              </button>
            </div>

            {/* Suggested Reels Carousel */}
            <h3 className="font-semibold mb-4">Suggested reels</h3>
            <div className="overflow-x-auto">
              <div className="flex gap-3 pb-4" style={{ width: "max-content" }}>
                {suggestedReels.map((reel) => (
                  <div
                    key={reel.id}
                    className="flex-shrink-0 w-32 cursor-pointer group"
                  >
                    <div className="relative w-32 h-56 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg overflow-hidden mb-2">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="absolute bottom-2 left-2 text-white text-xs">
                        {reel.views} views
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                    </div>
                    <h4 className="text-xs font-medium leading-tight mb-1 line-clamp-2">
                      {reel.title}
                    </h4>
                    <p className="text-xs text-gray-600">{reel.username}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Videos */}
            <div className="space-y-3 mb-8 mt-3">
              {suggestedVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="relative w-40 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-600">{video.username}</p>
                    <p className="text-xs text-gray-500">
                      {video.views} • {video.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comments Section  */}
            <div className=" block lg:hidden border-t pt-6 order-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {comments.length} Comments
                </h3>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sort by
                </button>
              </div>

              {/* Comment Input */}
              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  Y
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border-b-2 border-gray-200 focus:border-gray-400 outline-none resize-none"
                    rows="1"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => setNewComment("")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {comment.username.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {comment.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          • {comment.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          <span className="text-xs">{comment.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                          </svg>
                        </button>
                        <button className="text-xs text-gray-600 hover:text-gray-800 font-medium">
                          Reply
                        </button>
                      </div>
                      {comment.replies > 0 && (
                        <button className="flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {comment.replies} Replies
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoView;
