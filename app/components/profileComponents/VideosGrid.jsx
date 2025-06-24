import React from "react";
import { Clock, EllipsisVertical, Heart, Menu, Play } from "lucide-react";
import getTimeAgo from "@/app/lib/utils/getTimeAgo";
import useVideoThumbnail from "../../hooks/useVideoThumbnail";
import { useRouter } from "next/navigation";

const VideosGrid = ({ videoPosts }) => {
  const router = useRouter();
  // Mock data for videos
  const videos = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    viewCount: Math.floor(Math.random() * 1000) + "K",
    title: `Video ${i + 1} - How to create amazing content for social media`,
    duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(
      Math.random() * 60
    )
      .toString()
      .padStart(2, "0")}`,
    thumbnail: `/video-${(i % 3) + 1}.jpg`,
    uploadedDate: `${Math.floor(Math.random() * 30) + 1} days ago`,
    description:
      "Learn how to create engaging content for your social media profiles",
  }));

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videoPosts.map((video) => (
          <div key={video.post_id} className="overflow-hidden">
            <div onClick={()=>router.push(`/post/${video.post_id}`)} className="relative aspect-video bg-gray-300 overflow-hidden group cursor-pointer">
              {/* Use a placeholder image for the video thumbnail */}
              {/* <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ 
                  backgroundImage: `url(https://source.unsplash.com/random/?tech,${video.id})` 
                }}
              /> */}
              <video
                src={video.url[0]}
                className="w-full h-full object-cover"
                autoPlay={false}
                preload="metadata"
                muted
              />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  variant="ghost"
                  size="icon"
                  className="bg-black/30 text-white rounded-full h-14 w-14 flex items-center justify-center"
                >
                  <Play className="h-7 w-7" />
                </button>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video?.duration}
              </div>

              {/* View count */}
              <div className="absolute bottom-2 left-2 text-white text-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="ml-1">{video?.viewCount}</span>
              </div>
            </div>

            <div className="p-1">
              <div className="">
                <h3 className="text-sm font-medium line-clamp-2 mb-1 flex justify-between items-center">
                  {video.title}
                  <button variant="ghost" size="sm" className="">
                    <EllipsisVertical size={18} color="gray" />
                  </button>
                </h3>
                {/* <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                  {video.description}
                </p> */}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Heart size={16} color="gray" />
                  &nbsp;
                  <span className="">
                    {video.likes_count}&nbsp;&nbsp;•&nbsp;&nbsp;
                  </span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{getTimeAgo(video.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosGrid;
