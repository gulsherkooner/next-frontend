"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MessageSquareText,
  ThumbsUp,
  X,
  ArrowDown,
  SendHorizonal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import getTimeAgo from "../../lib/utils/getTimeAgo";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteComment,
  postComment,
  likeComment,
  unlikeComment,
} from "../../features/comments/commentSlice";

const ImageView = ({ post, image }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showReplies, setShowReplies] = useState({});
  const [replyOpen, setReplyOpen] = useState({});
  const [replyText, setReplyText] = useState({});
  const [likeTimeouts, setLikeTimeouts] = useState({});
  const [commentLikes, setCommentLikes] = useState({}); // { [commentId]: [userId, ...] }
  const self = useSelector((state) => state.auth?.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const touchStartX = useRef(null);
  const [postComments, setPostComments] = useState();
  const [moreMenuOpen, setMoreMenuOpen] = useState({});

  console.log("post:", post);
  

  const fetchComments = async () => {
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(
        `${apiGatewayUrl}/comments/post/${post.post_id}`
      );
      const data = await response.json();
      setPostComments(data);
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Fetch likes for all comments and replies for this post
  const fetchLikes = async () => {
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(
        `${apiGatewayUrl}/comments/post/${post.post_id}/likes`
      );
      const data = await response.json();
      setCommentLikes(data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchLikes();
    // eslint-disable-next-line
  }, [dispatch, post?.post_id]);

  useEffect(() => {
    if (!post?.url) {
      dispatch(fetchPublicPosts());
    }
  }, [post?.url, dispatch]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post?.url.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + post?.url.length) % post?.url.length
    );
  };

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0) {
        nextImage(); // Swipe left
      } else {
        prevImage(); // Swipe right
      }
    }
    touchStartX.current = null;
  };

  const handleComment = (parent_comment_id = null) => {
    const text = parent_comment_id
      ? replyText[parent_comment_id]
      : replyText["main"];
    if (!text || !text.trim()) return;
    dispatch(
      postComment({ post_id: post.post_id, text, parent_comment_id })
    ).then(() => {
      setReplyText((prev) => ({ ...prev, [parent_comment_id || "main"]: "" }));
      fetchComments();
    });
    setReplyOpen((prev) => ({ ...prev, [parent_comment_id]: false }));
  };

  const getReplies = (commentId) => {
    if (!postComments) return [];
    return postComments.filter((c) => c.parent_comment_id === commentId);
  };

  const handleDeleteComment = (commentId) => {
    // Call your deleteComment thunk or API here
    dispatch(deleteComment(commentId)).then(() => fetchComments());
  };

  // Utility to debounce actions per comment/reply
  const debounceAction = (id, action) => {
    if (likeTimeouts[id]) return; // Prevent double fire
    setLikeTimeouts((prev) => ({ ...prev, [id]: true }));
    action();
    setTimeout(() => {
      setLikeTimeouts((prev) => {
        const newTimeouts = { ...prev };
        delete newTimeouts[id];
        return newTimeouts;
      });
    }, 700); // 700ms debounce
  };

  // Like/Unlike handler for comments and replies
  const handleLike = (commentId) => {
    debounceAction(commentId, () => {
      const likedByUser = commentLikes[commentId]?.includes(self?.user_id);
      if (likedByUser) {
        dispatch(unlikeComment(commentId)).then(() => {
          fetchComments();
          fetchLikes();
        });
      } else {
        dispatch(likeComment(commentId)).then(() => {
          fetchComments();
          fetchLikes();
        });
      }
    });
  };

  // Like/Unlike handler for the post itself
  // const handlePostLike = () => {
  //   debounceAction(post.post_id, () => {
  //     if (postLikes[post.post_id]) {
  //       dispatch(unlikeComment(post.post_id)).then(() => {
  //         fetchComments();
  //         fetchLikes();
  //       });
  //     } else {
  //       dispatch(likeComment(post.post_id)).then(() => {
  //         fetchComments();
  //         fetchLikes();
  //       });
  //     }
  //   });
  // };

  return (
    <div className="flex-1 flex pt-14 flex-col md:flex-row h-full md:max-w-screen  w-screen overflow-hidden">
      {/* Desktop layout */}
      <div className="flex flex-col lg:flex-row bg-white rounded-lg overflow-y-scroll lg:overflow-hidden h-[calc(100vh-112px)] md:h-[calc(100vh-56px)] w-full">
        {/* Left side - Image carousel */}
        <div
          className="relative flex-1 bg-gray-200 min-h-[calc(100vh-112px)] flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {!image && (
            <button
              onClick={prevImage}
              className="absolute left-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <img
            src={post?.url[currentImageIndex]}
            alt="Post content"
            className="w-full h-full object-contain"
          />

          {!image && (
            <button
              onClick={nextImage}
              className="absolute right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {post?.url.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
          >
            <span className="w-5 h-5 flex items-center justify-center text-lg font-semibold">
              <X className="w-5 h-5" />
            </span>
          </button>
        </div>

        {/* Right side - Comments */}
        <div className="lg:w-3/10 flex flex-col">
          {/* Comments header */}
          <div className="p-4 border-b border-gray-200 flex gap-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0">
              <img
                src={post?.user?.profile_img_url}
                alt="User avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {post?.user?.username}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {getTimeAgo(post.created_at)}
                  </span>
                </div>
                <button className="ml-auto">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <h2 className="text-sm font-semibold text-gray-700 mt-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-700 mb-2">{post.description}</p>
            </div>
          </div>

          {/* Scrollable comments list */}
          <div className="flex-1 overflow-y-auto order-3 lg:order-2">
            <div className="p-4 space-y-4">
              {postComments &&
                postComments
                  ?.filter((comment) => comment.parent_comment_id === null && !comment.is_deleted) // Only top-level and not deleted
                  .map((comment) => (
                    <div key={comment.comment_id} className="space-y-3">
                      {/* Main comment */}
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0">
                          <img
                            src={comment.profile_img_url} // Replace with user's avatar if available
                            alt="User avatar"
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {comment.username}
                            </span>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-gray-500 text-xs">
                              {getTimeAgo(comment.created_at)}
                            </span>
                            <div className="relative ml-auto">
                              <button
                                onClick={() =>
                                  setMoreMenuOpen((prev) => ({
                                    ...prev,
                                    [comment.comment_id]:
                                      !prev[comment.comment_id],
                                  }))
                                }
                              >
                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                              </button>
                              {moreMenuOpen[comment.comment_id] && (
                                <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
                                  <button
                                    className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                                    onClick={() => {
                                      setMoreMenuOpen({});
                                      handleDeleteComment(comment.comment_id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {comment.text}
                          </p>
                          <div className="flex flex-col items-start justify-center gap-2 text-xs">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleLike(comment.comment_id)}
                                className={`flex items-center gap-1 ${
                                  commentLikes[comment.comment_id]?.includes(self?.user_id)
                                    ? "text-black"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                                disabled={!!likeTimeouts[comment.comment_id]}
                              >
                                <ThumbsUp
                                  className={`w-4 h-4 ${
                                    commentLikes[comment.comment_id]?.includes(self?.user_id)
                                      ? "fill-black"
                                      : ""
                                  }`}
                                />
                                {comment.likes_count > 0 &&
                                  formatNumber(comment.likes_count)}
                              </button>
                              <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() =>
                                  setReplyOpen((prev) => ({
                                    ...prev,
                                    [comment.comment_id]:
                                      !prev[comment.comment_id],
                                  }))
                                }
                              >
                                <span>• </span>
                                Reply
                              </button>
                            </div>
                            {replyOpen[comment.comment_id] && (
                              <div className="flex gap-3 items-center py-3 px-4 bg-gray-100 rounded-xl mt-2 w-full max-w-full">
                                <img
                                  src={self?.profile_img_url}
                                  alt="User avatar"
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                                <textarea
                                  placeholder="Write a comment"
                                  className="flex-1 bg-gray-100 border-none outline-none resize-none text-sm px-3 py-2 placeholder-gray-500 no-scrollbar"
                                  value={replyText[comment.comment_id] || ""}
                                  onChange={(e) =>
                                    setReplyText((prev) => ({
                                      ...prev,
                                      [comment.comment_id]: e.target.value,
                                    }))
                                  }
                                />
                                <button
                                  disabled={
                                    !(
                                      replyText[comment.comment_id] || ""
                                    ).trim()
                                  }
                                  onClick={() =>
                                    handleComment(comment.comment_id)
                                  }
                                  className="bg-teal-500 text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                  <SendHorizonal size={20} />
                                </button>
                              </div>
                            )}
                            {getReplies(comment.comment_id).length > 0 && (
                              <button
                                onClick={() =>
                                  toggleReplies(comment.comment_id)
                                }
                                className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                              >
                                <span>
                                  <ArrowDown size={16} />
                                </span>
                                {getReplies(comment.comment_id).length} Replies
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Replies */}
                      {showReplies[comment.comment_id] &&
                        getReplies(comment.comment_id)
                          .filter((reply) => !reply.is_deleted) // Only show replies that are not deleted
                          .map((reply) => (
                            <div key={reply.comment_id} className="ml-8 flex gap-3">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0">
                                <img
                                  src={reply.profile_img_url}
                                  alt="User avatar"
                                  className="w-full h-full rounded-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm">
                                    {reply.username}
                                  </span>
                                  <span className="text-gray-500 text-xs">•</span>
                                  <span className="text-gray-500 text-xs">
                                    {getTimeAgo(reply.created_at)}
                                  </span>
                                  <div className="relative ml-auto">
                                    <button
                                      onClick={() =>
                                        setMoreMenuOpen((prev) => ({
                                          ...prev,
                                          [reply.comment_id]:
                                            !prev[reply.comment_id],
                                        }))
                                      }
                                    >
                                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                    </button>
                                    {moreMenuOpen[reply.comment_id] && (
                                      <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
                                        <button
                                          className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                                          onClick={() => {
                                            setMoreMenuOpen({});
                                            handleDeleteComment(reply.comment_id);
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">
                                  {reply.text}
                                </p>
                                <div className="flex items-center gap-4 text-xs">
                                  <button
                                    onClick={() => handleLike(reply.comment_id)}
                                    className={`flex items-center gap-1 ${
                                      commentLikes[reply.comment_id]?.includes(self?.user_id)
                                        ? "text-black"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                                    disabled={!!likeTimeouts[reply.comment_id]}
                                  >
                                    <ThumbsUp
                                      className={`w-4 h-4 ${
                                        commentLikes[reply.comment_id]?.includes(self?.user_id)
                                          ? "fill-black"
                                          : ""
                                      }`}
                                    />
                                    {reply.likes_count > 0 && formatNumber(reply.likes_count)}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                    </div>
                  ))}
            </div>
          </div>

          {/* Action buttons and comment input */}
          <div className="p-4 border-t border-gray-200 w-full h-fit order-2 lg:order-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                  <ThumbsUp
                    className={`w-5 h-5 `}
                  />
                  {formatNumber(post.likes_count)}
                <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                  <Share className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center gap-1 ${
                    isSaved
                      ? "text-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                  />
                  Save
                </button>
              </div>
            </div>

            {/* Comment input */}
            <div className="flex gap-3 items-center py-3 px-4 bg-gray-100 rounded-xl mt-2">
              <img
                src={self?.profile_img_url} // Replace with user's avatar if available
                alt="User avatar"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <textarea
                placeholder="Write a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
                className="flex-1 bg-gray-100 border-none outline-none resize-none text-sm px-3 py-2 placeholder-gray-500 no-scrollbar"
                style={{ minHeight: 40 }}
              />
              <button
                disabled={!newComment.trim()}
                onClick={() => handleComment()}
                className="bg-teal-500 text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{ minWidth: 90 }}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageView;
