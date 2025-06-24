import React from "react";
import { Play, Film, Heart } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { useRouter } from "next/navigation";

const ReelsGrid = ({ reelPosts }) => {
  const isMobile = useIsMobile();
  const router = useRouter();

  // Mock data for reels
  const reels = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    viewCount: Math.floor(Math.random() * 500) + "K",
    likes: Math.floor(Math.random() * 50) + "K",
    title: `Reel video ${i + 1} - Amazing content for you`,
    duration: `${Math.floor(Math.random() * 2) + 1}:${Math.floor(
      Math.random() * 60
    )
      .toString()
      .padStart(2, "0")}`,
    thumbnail: `/reel-${(i % 3) + 1}.jpg`, // Assuming you have these images
    author: "User Profile",
    createdAt: `${Math.floor(Math.random() * 7) + 1} days ago`,
  }));

  return (
    <div className="p-2 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {reelPosts.map((reel) => (
          <div key={reel.post_id} className="overflow-hidden">
            <div onClick={()=>router.push(`/reels?id=${reel.post_id}`)}  className="relative aspect-[9/16] bg-gray-800 overflow-hidden group">
              {/* Use a placeholder image for the reel thumbnail */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://source.unsplash.com/random/?${
                    ["ocean", "matrix", "whale"][reel.post_id % 3]
                  })`,
                }}
              >
                <video
                  className="w-full h-full object-contain"
                  autoPlay={false}
                  preload="metadata"
                  muted
                  src={reel.url[0]}
                ></video>
              </div>

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  variant="ghost"
                  size="icon"
                  className="bg-black/30 text-white rounded-full h-12 w-12 sm:h-16 sm:w-16 flex justify-center items-center"
                >
                  <Play className="h-6 w-6 sm:h-8 sm:w-8" />
                </button>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                0:00
              </div>

              {/* View count */}
              <div className="absolute bottom-2 left-2 text-white text-xs sm:text-sm flex items-center">
                <Heart size={16} color="white" />
                <span className="ml-1">{reel.likes_count}&nbsp;•&nbsp;</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sm:w-4 sm:h-4"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="ml-1">{reel.views_count}</span>
              </div>
            </div>

            {/* <div className="p-2 sm:p-3">
              <h3 className="text-xs sm:text-sm font-medium line-clamp-2">{reel.title}</h3>
              <div className="flex justify-between items-center mt-1.5 sm:mt-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <Film className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="text-xs">{reel.author}</span>
                </div>
                <span className="text-xs">{reel.createdAt}</span>
              </div>
              <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                <div className="flex items-center text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3.5 sm:h-3.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span className="ml-1">{reel.likes}</span>
                </div>
                <button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsGrid;
