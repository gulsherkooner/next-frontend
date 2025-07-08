import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicReels } from "../features/posts/postsSlice";

const ReelCarousel = () => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isMobile = useIsMobile();
  const router = useRouter();
  const dispatch = useDispatch();

  // Generate a seed once per session/feed
  const [seed] = useState(() => Math.random().toString(36).slice(2));
  const [page] = useState(1);
  const [limit] = useState(6);

  // Local state for reels
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch public reels on mount
  useEffect(() => {
    if (reels.length === 0) {
      setLoading(true);
      dispatch(fetchPublicReels({ page, limit, seed }))
        .then((action) => {
          if (action.payload && action.payload.reels) {
            setReels(action.payload.reels);
          }
          setLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [dispatch, page, limit, seed, reels.length]);

  const scroll = (direction) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollAmount =
      direction === "left"
        ? -container.offsetWidth / 2
        : container.offsetWidth / 2;

    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => {
      checkScrollPosition();
    }, 300);
  };

  const checkScrollPosition = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 5
    );
  };

  return (
    <div className="mb-4">
      <h2 className="font-medium text-lg mb-3 px-1">Suggested reels</h2>
      <div className="relative">
        <div
          className="flex overflow-x-auto pb-2 scrollbar-hide px-1 space-x-2 no-scrollbar"
          ref={containerRef}
          onScroll={checkScrollPosition}
        >
          {loading ? (
            <div className="text-gray-500 px-4 py-8">Loading reels...</div>
          ) : reels.length === 0 ? (
            <div className="text-gray-500 px-4 py-8">No reels found.</div>
          ) : (
            reels.map((reel) => (
              <div
                key={reel.post_id}
                onClick={() => router.push(`/reels?id=${reel.post_id}`)}
                className="w-36 h-52 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden cursor-pointer"
              >
                {reel.url && reel.url[0] ? (
                  reel.post_type === "video" ? (
                    <video
                      src={reel.url[0]}
                      className="w-full h-full object-cover"
                      autoPlay={false}
                      preload="metadata"
                      muted
                    />
                  ) : (
                    <img
                      src={reel.url[0]}
                      alt="Reel thumbnail"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40">
                    <div className="w-5 h-5 border-t-transparent border-l-2 border-r-2 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Navigation buttons */}
        {!isMobile && (
          <>
            {canScrollLeft && (
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                onClick={() => scroll("left")}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {canScrollRight && (
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                onClick={() => scroll("right")}
              >
                <ChevronRight size={18} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReelCarousel;
