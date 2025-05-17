import React from "react";
import { Heart, List, MessageCircle } from "lucide-react";
import getTimeAgo from "@/app/lib/utils/getTimeAgo";
import { Riple } from "react-loading-indicators";

const PostsGrid = ({ imgPosts }) => {
  // Mock data for the posts
  const posts = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    viewCount: Math.floor(Math.random() * 100) + "K",
    title: "lorem ipsumor sit amet, consectetur adipiscing elit. Nu",
    itemCount: "188 items",
    visibility: "Public",
    updated: "2 days ago",
    saved: Math.random() > 0.6,
    pinned: i < 2 && Math.random() > 0.5,
  }));

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imgPosts?.map((post) => (
          <div key={post._id} className="relative">
            {/* Post thumbnail */}
            <div className="aspect-square bg-gray-300 rounded-md overflow-hidden relative group">
              {post.url[0] ? (
                <img src={post.url[0]} alt="Image not found" className=" w-full h-full object-cover object-center" />
              ) : (
                <Riple
                  color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
                  size="medium"
                  text=""
                  textColor=""
                />
              )}

              {/* Save indicator */}
              {/* {post.saved && (
                <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                </div>
              )} */}

              {/* Pin indicator */}
              {/* {post.pinned && (
                <div className="absolute top-2 left-2 text-white p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="17" y2="22"></line>
                    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                  </svg>
                </div>
              )} */}

              {/* Collection indicator */}
              <div className="absolute bottom-2 right-2">
                <List size={18} />
              </div>

              {/* View count */}
              {/* <div className="absolute bottom-2 left-2 text-white text-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="ml-1">{post.viewCount}</span>
              </div> */}
            </div>

            {/* Post details */}
            {/* <div className="mt-2">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium line-clamp-2">{post.title}</h3>
                <button className="text-gray-500 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 flex">
                <Heart size={14} color='red' fill='pink' />&nbsp;{post.likes_count} •&nbsp;<MessageCircle size={14} color='red' fill='pink' />&nbsp;{post.comments_count} • {post.visibility} • {getTimeAgo(post.created_at)}
              </div>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsGrid;
