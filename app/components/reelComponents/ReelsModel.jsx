import { useState, useEffect, useRef } from "react";
import ReelItem from "./ReelItem";
import { Pause, VolumeX, X } from "lucide-react";
import {
  Ellipsis,
  Menu,
  MessageSquareText,
  Music2,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { useDispatch } from "react-redux";
import { fetchPublicReels } from "../../features/posts/postsSlice";

const ReelsModal = ({ onClose, id }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const isScrolling = useRef(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const isMobile = useIsMobile();

  // PAGINATED REELS STATE
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [seed] = useState(() => Math.random().toString(36).slice(2));
  const [isFetching, setIsFetching] = useState(false);

  const dispatch = useDispatch();

  // Fetch reels (first page: include id, next pages: don't include id)
  useEffect(() => {
    setIsFetching(true);
    dispatch(
      fetchPublicReels({
        page: 1,
        limit: 5,
        seed,
        id, // only on first page
      })
    ).then((action) => {
      if (action.payload) {
        setReels(action.payload.reels || []);
        setTotalPages(action.payload.totalPages || 1);
        setPage(1);
      }
      setIsFetching(false);
    });
    // eslint-disable-next-line
  }, [id, seed, dispatch]);

  // Fetch next page when user scrolls to last reel
  useEffect(() => {
    if (currentIndex === reels.length - 1 && page < totalPages && !isFetching) {
      setIsFetching(true);
      dispatch(
        fetchPublicReels({
          page: page + 1,
          limit: 5,
          seed,
          // Do NOT include id on next pages
        })
      ).then((action) => {
        if (action.payload) {
          setReels((prev) => [...prev, ...(action.payload.reels || [])]);
          setPage(action.payload.page);
        }
        setIsFetching(false);
      });
    }
    // eslint-disable-next-line
  }, [currentIndex, page, totalPages, isFetching, dispatch, seed]);

  const scrollToIndex = (index) => {
    if (scrollRef.current && !isScrolling.current) {
      isScrolling.current = true;
      const container = scrollRef.current;
      const items = container.querySelectorAll(".reel-item-container");

      if (items[index]) {
        items[index].scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  };

  const handleScroll = (e) => {
    e.stopPropagation();
    if (isScrolling.current) return;

    const container = scrollRef.current;
    const scrollPosition = container.scrollTop;
    // Calculate index based on item height + gap
    const currentIndex = Math.round(scrollPosition / (796 + 8));

    setCurrentIndex(currentIndex);
  };

  const handleKeyDown = (e) => {
    if (isScrolling.current) return;

    if (e.key === "ArrowDown" && currentIndex < reels.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    } else if (e.key === "ArrowUp" && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    const container = scrollRef.current;
    if (container) container.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [currentIndex]);

  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <div className="bg-transparent z-10 w-fit overflow-hidden">
      {/* Reels Container */}
      <div
        ref={scrollRef}
        className="h-full md:w-[calc(100vw-225px)] overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar gap-3 flex flex-col items-center"
      >
        {reels.map((reel, index) => (
          <div
            key={reel.post_id}
            className="reel-item-container relative w-screen md:w-md md:h-[796] h-[calc(100vh-112px)] md:max-h-[calc(100vh-112px)] snap-start rounded-lg"
          >
            {/* Header with close button */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 px-2">
              <div className="text-white font-semibold text-lg">
                <Pause size={24} className="inline-block mr-2" />
                <VolumeX size={24} className="inline-block mr-2" />
              </div>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-300 transition-colors mr-2 md:hidden"
              >
                <X size={24} />
              </button>
            </div>

            {/* Reel Item with proper aspect ratio */}
            <div className="relative  w-screen md:w-[488px] md:max-w-[488px] md:h-[796] h-[calc(100vh-112px)] md:max-h-[calc(100vh-112px)] flex items-end justify-center rounded-lg">
              <ReelItem
                reel={reel}
                isActive={index === currentIndex}
                isLiked={isLiked}
                setIsLiked={setIsLiked}
                isSaved={isSaved}
                setIsSaved={setIsSaved}
                formatCount={formatCount}
                showComments={showComments}
                setShowComments={setShowComments}
              />

              {/* Right Side Actions */}
              {!isMobile && (
                <div className=" flex flex-col items-center gap-4 p-1 pb-3 justify-end">
                  {/* Like Button */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        isLiked
                          ? "bg-red-500 text-gray-600 scale-110"
                          : "bg-black/30 text-gray-600 hover:bg-black/50"
                      } backdrop-blur-sm`}
                    >
                      <ThumbsUp size={20} />
                    </button>
                    <span className="text-gray-600 text-xs mt-1 font-medium">
                      {formatCount(reel.likes_count + (isLiked ? 1 : 0))}
                    </span>
                  </div>

                  {/* Comment Button */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setShowComments(!showComments)}
                      className="p-2 rounded-full bg-black/30 text-gray-600 hover:bg-black/50 transition-all duration-200 backdrop-blur-sm"
                    >
                      <MessageSquareText size={20} />
                    </button>
                    <span className="text-gray-600 text-xs mt-1 font-medium">
                      {formatCount(reel.comments_count)}
                    </span>
                  </div>

                  {/* Share Button */}
                  {/* <div className="flex flex-col items-center">
                    <button className="p-2 rounded-full bg-black/30 text-gray-600 hover:bg-black/50 transition-all duration-200 backdrop-blur-sm">
                      <Share2 size={20} />
                    </button>
                    <span className="text-gray-600 text-xs mt-1 font-medium">
                      {formatCount(reel.shares)}
                    </span>
                  </div> */}

                  {/* Save Button */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => setIsSaved(!isSaved)}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        isSaved
                          ? "bg-yellow-500 text-gray-600 scale-110"
                          : "bg-black/30 text-gray-600 hover:bg-black/50"
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
                      className={`p-2 rounded-lg transition-all duration-200 bg-black/30 text-gray-600 hover:bg-black/50 backdrop-blur-sm`}
                    >
                      <Ellipsis size={20} />
                    </button>
                  </div>

                  {/* Music Button */}
                  <div className="flex flex-col items-center">
                    <button
                      className={`p-2 rounded-lg transition-all duration-200 bg-black/30 text-gray-600 hover:bg-black/50 backdrop-blur-sm`}
                    >
                      <Music2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isFetching && (
          <div className="text-center text-gray-500 py-4">
            Loading more reels...
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {!isMobile && (
        <div className="absolute right-3 xl:right-10 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-3">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                const newIndex = currentIndex - 1;
                scrollToIndex(newIndex);
                setCurrentIndex(newIndex);
              }
            }}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-black/30 text-gray-600 hover:bg-black/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>

          {/* <div className="text-gray-600 text-xs bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 text-center">
          {currentIndex + 1}/{reels.length}
        </div> */}

          <button
            onClick={() => {
              if (currentIndex < reels.length - 1) {
                const newIndex = currentIndex + 1;
                scrollToIndex(newIndex);
                setCurrentIndex(newIndex);
              }
            }}
            disabled={currentIndex === reels.length - 1}
            className="p-2 rounded-full bg-black/30 text-gray-600 hover:bg-black/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReelsModal;
