import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import getTimeAgo from "../../lib/utils/getTimeAgo";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  likePost,
  unlikePost,
  fetchUserLikeForPost,
  fetchAllLikesForPost, // <-- import the function
} from "../../features/posts/postsLikesSlice";

const Post = ({
  post_id,
  created_at,
  description,
  url,
  likes_count,
  comments_count,
  post_type,
  user,
  title,
  user_id,
  is_reel,
}) => {
  const [saved, setSaved] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [allLikes, setAllLikes] = useState([]); // <-- state for all likes
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.auth?.user);
  const userLikes = useSelector((state) => state.postLikes.userLikes);

  useEffect(() => {
    if (state?.user_id && post_id) {
      dispatch(fetchUserLikeForPost(post_id));
    }
  }, [state?.user_id, post_id, dispatch]);

  // Fetch all likes for this post (public)
  useEffect(() => {
    let isMounted = true;
    fetchAllLikesForPost(post_id)
      .then((likes) => {
        if (isMounted) setAllLikes(likes || []);
      })
      .catch(() => {
        if (isMounted) setAllLikes([]);
      });
    return () => {
      isMounted = false;
    };
  }, [post_id, userLikes[post_id]]); // refetch when like status changes

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    };

    const observer = new window.IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  const toggleSave = () => setSaved((prev) => !prev);

  const router = useRouter();

  const shortenedContent =
    description?.length > 150
      ? description?.substring(0, 150) + "..."
      : description;

  const handleClick = (e) => {
    e.stopPropagation();
    user_id && user_id === state.user_id
      ? router.push("/profile")
      : router.push(`/${user_id}`);
  };

  const handleLike = async () => {
    if (!state?.user_id) return; // Optionally show login prompt
    if (userLikes[post_id]) {
      await dispatch(unlikePost(post_id));
    } else {
      await dispatch(likePost(post_id));
    }
    dispatch(fetchUserLikeForPost(post_id));
    dispatch(fetchAllLikesForPost(post_id));
  };

  const handlePost = (e) => {
    e.stopPropagation();
    if (is_reel) {
      router.push(`/reels?id=${post_id}`);
    } else {
      router.push(`/post/${post_id}`);
    }
  };

  return (
    <div className="bg-white md:rounded-lg shadow mb-4">
      <div onClick={(e) => handlePost(e)} className="p-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={handleClick}
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0">
              {user?.profile_img_url && (
                <img
                  className="rounded-full"
                  src={user.profile_img_url}
                  alt="*"
                />
              )}
            </div>
            <div className="ml-3">
              <div className="font-medium">
                {user?.username ? user.username : "Username"}
              </div>
              <div className="text-gray-500 text-xs">
                {getTimeAgo(created_at)}
              </div>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="mt-3">
          <p className="text-md font-bold">{title}</p>
          <p className="text-sm text-gray-700">
            {showFullContent ? description : shortenedContent}
            {description?.length > 150 && (
              <button
                onClick={() => setShowFullContent((prev) => !prev)}
                className="text-gray-500 hover:text-gray-700 ml-1 text-xs font-medium"
              >
                {showFullContent ? "See less" : "See more"}
              </button>
            )}
          </p>
        </div>
      </div>

      {post_type === "image" && (
        <div
          className="w-full max-h-[calc(100vh-224px)] bg-gray-200 flex items-center justify-center overflow-hidden"
          onClick={() => router.push(`/post/${post_id}`)}
        >
          <img
            src={url[0]}
            alt="Post"
            className="w-full h-full max-h-[calc(100vh-224px)] object-cover"
          />
        </div>
      )}

      {post_type === "video" && (
        <div
          className="w-full max-h-[calc(100vh-224px)] bg-gray-200 flex items-center justify-center relative overflow-hidden"
          onClick={() => is_reel && router.push(`/reels?id=${post_id}`)}
        >
          <video
            ref={videoRef}
            src={url[0]}
            className={`w-full h-full object-cover ${
              is_reel ? "max-h-[calc(100vh-224px)]" : "aspect-video"
            }`}
            controls={!is_reel}
          ></video>
        </div>
      )}

      <div className="p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center text-sm font-medium ${
              userLikes[post_id] ? "text-red-500" : "text-gray-500"
            }`}
          >
            <Heart
              size={18}
              className={`mr-1 ${userLikes[post_id] ? "fill-red-500" : ""}`}
            />{" "}
            {allLikes.length}
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
