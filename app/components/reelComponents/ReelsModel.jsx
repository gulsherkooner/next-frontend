import { useState, useEffect, useRef } from "react";
import ReelItem from "./ReelItem";
import { Pause, VolumeX, X } from "lucide-react";

const ReelsModal = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const isScrolling = useRef(false);

  // Sample reel data
  const reels = [
    {
      id: 1,
      username: "user_name_1",
      description:
        "Amazing sunset timelapse from the mountains! Nature is absolutely beautiful 🌅",
      likes: 1234,
      comments: 89,
      shares: 45,
      videoUrl:
        "https://videos.pexels.com/video-files/4830364/4830364-uhd_1440_2732_25fps.mp4",
      backgroundSound: "Original Audio",
      location: "Mountain View",
    },
    {
      id: 2,
      username: "creative_artist",
      description:
        "Digital art creation process in 60 seconds ✨ Follow for more art content!",
      likes: 2567,
      comments: 156,
      shares: 78,
      videoUrl:
        "https://videos.pexels.com/video-files/4830364/4830364-uhd_1440_2732_25fps.mp4",
      backgroundSound: "Trending Audio",
      location: "Art Studio",
    },
    {
      id: 3,
      username: "fitness_guru",
      description:
        "Quick 5-minute morning workout routine 💪 Start your day right!",
      likes: 3421,
      comments: 234,
      shares: 123,
      videoUrl:
        "https://videos.pexels.com/video-files/4830364/4830364-uhd_1440_2732_25fps.mp4",
      backgroundSound: "Workout Beats",
      location: "Home Gym",
    },
    {
      id: 4,
      username: "food_lover",
      description:
        "Perfect chocolate chip cookies recipe 🍪 Save this for later!",
      likes: 4567,
      comments: 345,
      shares: 189,
      videoUrl:
        "https://videos.pexels.com/video-files/4830364/4830364-uhd_1440_2732_25fps.mp4",
      backgroundSound: "Cooking Vibes",
      location: "Kitchen",
    },
    {
      id: 5,
      username: "travel_enthusiast",
      description:
        "Hidden gems in Tokyo you must visit! 🇯🇵 Which one is your favorite?",
      likes: 5678,
      comments: 456,
      shares: 234,
      videoUrl:
        "https://videos.pexels.com/video-files/4830364/4830364-uhd_1440_2732_25fps.mp4",
      backgroundSound: "Tokyo Nights",
      location: "Tokyo, Japan",
    },
    {
      id: 6,
      username: "travel_enthusiast",
      description:
        "Hidden gems in Tokyo you must visit! 🇯🇵 Which one is your favorite?",
      likes: 5678,
      comments: 456,
      shares: 234,
      videoUrl:
        "https://videos.pexels.com/video-files/4830364/4830364-uhd_1440_2732_25fps.mp4",
      backgroundSound: "Tokyo Nights",
      location: "Tokyo, Japan",
    },
    {
      id: 7,
      username: "travel_enthusiast",
      description:
        "Hidden gems in Tokyo you must visit! 🇯🇵 Which one is your favorite?",
      likes: 5678,
      comments: 456,
      shares: 234,
      videoUrl:
        "https://videos.pexels.com/video-files/4830364/4830364-uhd_1440_2732_25fps.mp4",
      backgroundSound: "Tokyo Nights",
      location: "Tokyo, Japan",
    },
    {
      id: 8,
      username: "travel_enthusiast",
      description:
        "Hidden gems in Tokyo you must visit! 🇯🇵 Which one is your favorite?",
      likes: 5678,
      comments: 456,
      shares: 234,
      videoUrl:
        "https://videos.pexels.com/video-files/4830364/4830364-uhd_1440_2732_25fps.mp4",
      backgroundSound: "Tokyo Nights",
      location: "Tokyo, Japan",
    },
  ];

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
    container.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [currentIndex]);

  return (
    <div className="bg-transparent z-10 w-fit overflow-hidden">
      {/* Reels Container */}
      <div
        ref={scrollRef}
        className="h-full md:w-[calc(100vw-225px)] overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar gap-3 flex flex-col items-center"
      >
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="relative w-screen md:w-md md:h-[796] h-[calc(100vh-112px)] snap-start rounded-lg" // Changed to h-screen and removed flex
          >
            {/* Header with close button */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent rounded-t-lg">
              <div className="text-white font-semibold text-lg">
                <Pause size={24} className="inline-block mr-2" />
                <VolumeX size={24} className="inline-block mr-2" />
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300 transition-colors mr-2 md:hidden"
              >
                <X size={24} />
              </button>
            </div>

            {/* Reel Item with proper aspect ratio */}
            <div className="relative  w-screen md:w-md md:max-w-md md:h-[796] h-[calc(100vh-112px)] flex items-center justify-center rounded-lg">
              <ReelItem reel={reel} isActive={index === currentIndex} />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {/* <div className="absolute right-3 xl:right-10 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-3">
        <button
          onClick={() => {
            if (currentIndex > 0) {
              const newIndex = currentIndex - 1;
              scrollToIndex(newIndex);
              setCurrentIndex(newIndex);
            }
          }}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
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

        <div className="text-white text-xs bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 text-center">
          {currentIndex + 1}/{reels.length}
        </div>

        <button
          onClick={() => {
            if (currentIndex < reels.length - 1) {
              const newIndex = currentIndex + 1;
              scrollToIndex(newIndex);
              setCurrentIndex(newIndex);
            }
          }}
          disabled={currentIndex === reels.length - 1}
          className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-sm"
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
      </div> */}
    </div>
  );
};

export default ReelsModal;
