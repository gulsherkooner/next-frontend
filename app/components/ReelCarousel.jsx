import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReelCarousel = () => {
  const img =
    "https://images.unsplash.com/photo-1602492665157-639323eadd31?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aW5zdGFncmFtJTIwcmVlbHN8ZW58MHx8MHx8fDA%3D";
  // Normally we would fetch these from an API
  const reels = [
    { id: 1, imageUrl: `${img}` },
    { id: 2, videoUrl: `${img}` },
    { id: 3, imageUrl: `` },
    { id: 4, imageUrl: `${img}` },
    { id: 5, imageUrl: `` },
    { id: 6, imageUrl: `${img}` },
    { id: 7, imageUrl: `${img}` },
    { id: 8, imageUrl: `${img}` },
    { id: 9, imageUrl: `${img}` },
    { id: 10, imageUrl: `${img}` },
  ];

  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);  

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

    // We need to wait for the scroll to finish to check scroll position
    setTimeout(() => {
      checkScrollPosition();
    }, 300);
  };

  const checkScrollPosition = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Check if we can scroll left (not at the start)
    setCanScrollLeft(container.scrollLeft > 0);

    // Check if we can scroll right (not at the end)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 5 // 5px buffer for rounding errors
    );
  };

  return (
    <div className="mb-4">
      <h2 className="font-medium text-lg mb-3 px-1">Suggested reels</h2>
      <div className="relative">
        <div
          className="flex overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 space-x-2 no-scrollbar"
          ref={containerRef}
          onScroll={checkScrollPosition}
        >
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="w-36 h-52 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden"
            >
              {reel.imageUrl ? (
                <img
                  src={reel.imageUrl}
                  alt="Reel thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : reel.videoUrl ? (
                <video
                  src={reel.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  controls
                  loop
                  muted
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40">
                  <div className="w-5 h-5 border-t-transparent border-l-2 border-r-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
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
      </div>
    </div>
  );
};

export default ReelCarousel;
