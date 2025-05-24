import { useState, useRef, useEffect } from "react";
import {
  Ellipsis,
  Menu,
  MessageSquareText,
  Music2,
  Share2,
  ThumbsUp,
} from "lucide-react";

const ReelItem = ({ reel, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            console.error("Video playback failed");
            setIsPlaying(false);
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Error playing video:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <div
      className="relative w-full h-full flex-shrink-0 bg-black overflow-hidden rounded-lg"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className=" w-full h-full object-center object-contain md:rounded-lg"
        loop
        playsInline
        onClick={togglePlayPause}
        style={{ cursor: "pointer" }}
      >
        <source src={reel.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video Overlay */}
      <div className="bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

      {/* Play/Pause Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-lg">
          <div className="bg-black/30 backdrop-blur-sm rounded-full p-3 animate-scale-in">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-4 flex flex-col items-center gap-4">
        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-all duration-200 ${
              isLiked
                ? "bg-red-500 text-white scale-110"
                : "bg-black/30 text-white hover:bg-black/50"
            } backdrop-blur-sm`}
          >
            <ThumbsUp size={20} />
          </button>
          <span className="text-white text-xs mt-1 font-medium">
            {formatCount(reel.likes + (isLiked ? 1 : 0))}
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setShowComments(!showComments)}
            className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200 backdrop-blur-sm"
          >
            <MessageSquareText size={20} />
          </button>
          <span className="text-white text-xs mt-1 font-medium">
            {formatCount(reel.comments)}
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <button className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200 backdrop-blur-sm">
            <Share2 size={20} />
          </button>
          <span className="text-white text-xs mt-1 font-medium">
            {formatCount(reel.shares)}
          </span>
        </div>

        {/* Save Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-full transition-all duration-200 ${
              isSaved
                ? "bg-yellow-500 text-white scale-110"
                : "bg-black/30 text-white hover:bg-black/50"
            } backdrop-blur-sm`}
          >
            <svg
              className="w-5 h-5"
              fill={isSaved ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>

        {/* Menu Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-full transition-all duration-200 ${
              isSaved
                ? "bg-yellow-500 text-white scale-110"
                : "bg-black/30 text-white hover:bg-black/50"
            } backdrop-blur-sm`}
          >
            <Ellipsis size={20} />
          </button>
        </div>

        {/* Music Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isSaved
                ? "bg-yellow-500 text-white scale-110"
                : "bg-black/30 text-white hover:bg-black/50"
            } backdrop-blur-sm`}
          >
            <Music2 size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 pb-6">
        {/* User Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              {reel.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-white font-semibold text-sm">
            {reel.username}
          </span>
          <button className="px-3 py-0.5 bg-red-600 text-white text-xs rounded-full hover:bg-red-700 transition-colors">
            Follow
          </button>
        </div>

        {/* Description */}
        <p className="text-white text-xs mb-2 leading-relaxed max-w-xs">
          {reel.description}
        </p>

        <div className="flex justify-start items-center gap-2">
          {/* Music/Audio Info */}
          <div className="flex items-center gap-1 ">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            <span className="text-white text-xs opacity-90">
              {reel.backgroundSound}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-white text-xs opacity-90">
              {reel.location}
            </span>
          </div>
        </div>
      </div>

      {/* Comments Overlay */}
      {showComments && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-end">
          <div className="w-full bg-white rounded-t-2xl p-4 max-h-2/3 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">Comments</h3>
              <button
                onClick={() => setShowComments(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-300"></div>
                <div>
                  <div className="text-xs font-medium">user123</div>
                  <div className="text-xs text-gray-600">
                    Great content! Love it 😍
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-300"></div>
                <div>
                  <div className="text-xs font-medium">another_user</div>
                  <div className="text-xs text-gray-600">
                    Amazing! How did you do this?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelItem;
