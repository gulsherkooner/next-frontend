import React, { useRef, useState } from "react";
import { Image, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import { useRouter } from "next/navigation";

const Story = ({ username, imageUrl, isViewed = false }) => {
  const Router = useRouter();
  return (
    <div onClick={()=>Router.push('/stories')} className="flex flex-col items-center justify-center space-y-1 cursor-pointer">
      <div
        className={`w-16 h-16 rounded-full p-[2px] ${
          isViewed
            ? "bg-gray-300"
            : "bg-gradient-to-tr from-yellow-400 to-pink-600"
        }`}
      >
        <div className="bg-white p-[2px] rounded-full h-full w-full flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${username}'s story`}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <Image size={20} className="text-gray-400" />
            </div>
          )}
        </div>
      </div>
      <span className="text-xs text-center truncate w-16">{username}</span>
    </div>
  );
};

const StoryBar = () => {
  const img =
    "https://wallpapers.com/images/featured/ig-story-background-by491yicsgjsnfsf.jpg";
  // Sample stories data
  const stories = [
    { username: "Your Story", imageUrl: `${img}`, isViewed: false },
    { username: "user_one", imageUrl: `${img}`, isViewed: false },
    { username: "user_two", imageUrl: `${img}`, isViewed: true },
    { username: "user_three", imageUrl: `${img}`, isViewed: false },
    { username: "user_four", imageUrl: `${img}`, isViewed: true },
    { username: "user_five", imageUrl: `${img}`, isViewed: false },
    { username: "user_six", imageUrl: `${img}`, isViewed: false },
    { username: "user_seven", imageUrl: `${img}`, isViewed: true },
    { username: "user_eight", imageUrl: `${img}`, isViewed: false },
    { username: "user_seven", imageUrl: `${img}`, isViewed: true },
    { username: "user_eight", imageUrl: `${img}`, isViewed: false },
  ];

  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isMobile = useIsMobile();

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
    <div className="py-0 rounded-lg mb-4 overflow-hidden relative">
      <div
        className="flex space-x-4 overflow-x-auto pb-1 no-scrollbar"
        ref={containerRef}
        onScroll={checkScrollPosition}
      >
        {stories.map((story, index) => (
          <Story
            key={index}
            username={story.username}
            imageUrl={story.imageUrl}
            isViewed={story.isViewed}
          />
        ))}
      </div>
      {/* Navigation buttons - only visible when there is content to scroll to */}
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
  );
};

export default StoryBar;
