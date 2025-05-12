import React, { useState } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import getTimeAgo  from "../lib/utils/getTimeAgo";

const Post = ({
  created_at,
  description,
  url,
  likes_count,
  comments_count,
  post_type,
  user
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const toggleLike = () => setLiked(!liked);
  const toggleSave = () => setSaved(!saved);

  const shortenedContent =
  description.length > 150 ? description.substring(0, 150) + "..." : description;

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0">
              {user.profile_img_url && (
                <img
                  src={user.profile_img_url}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </div>
            <div className="ml-3">
              <div className="font-medium">{user.username}</div>
              <div className="text-gray-500 text-xs">{getTimeAgo(created_at)}</div>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="mt-3">
          <p className="text-sm text-gray-700">
            {showFullContent ? description : shortenedContent}
            {description.length > 150 && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-gray-500 hover:text-gray-700 ml-1 text-xs font-medium"
              >
                {showFullContent ? "See less" : "See more"}
              </button>
            )}
          </p>
        </div>
      </div>

      {post_type == "image" && (
        <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
          <img
            src={url[0]}
            alt="Post"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      {post_type == "video" && (
        <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center relative">
          <video
            src={url[0]}
            className="w-full h-full object-contain"
            controls
            poster="/placeholder.svg"
          ></video>

          {/* {views && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center text-white text-xs">
              <div className="flex-1 h-1 bg-white/30 rounded-full relative">
                <div className="absolute h-1 w-1/4 bg-white rounded-full"></div>
              </div>
              <div className="ml-2">{views} views</div>
            </div>
          )} */}
        </div>
      )}

      <div className="p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={toggleLike}
            className={`flex items-center text-sm font-medium ${
              liked ? "text-red-500" : "text-gray-500"
            }`}
          >
            <Heart
              size={18}
              className={`mr-1 ${liked ? "fill-red-500" : ""}`}
            />{" "}
            {likes_count}
          </button>

          <button className="flex items-center text-sm font-medium text-gray-500">
            <MessageSquare size={18} className="mr-1" /> {comments_count}
          </button>

          <button className="flex items-center text-sm font-medium text-gray-500">
            <Share2 size={18} className="mr-1" /> Share
          </button>
        </div>

        <button
          onClick={toggleSave}
          className={`text-sm font-medium ${
            saved ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <Bookmark size={18} className={saved ? "fill-blue-500" : ""} />
        </button>
      </div>
    </div>
  );
};

export default Post;
