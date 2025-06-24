import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Volume2,
  MoreHorizontal,
  Play,
  VolumeX,
  Plus,
} from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import CreateStory from "./CreateStory";
import getTimeAgo from "../../lib/utils/getTimeAgo";
import { updateStory } from "../../features/stories/storiesslice";
import { useDispatch } from "react-redux";

const Stories = ({ storiesArray = [], self, data }) => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedStory, setSelectedStory] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const viewTimeoutRef = useRef(null);

  // Modified users array preparation with viewed status
  const users = storiesArray
    .map((entry) => {
      const isAllStoriesViewed = entry.stories?.every((story) =>
        story.viewed_by?.includes(self)
      );

      return {
        user_id: entry.user_id,
        stories: entry.stories,
        isSelf: entry.user_id === self,
        isViewed: isAllStoriesViewed,
        // Get the user info from the first story
        userInfo: entry.stories?.[0]?.user || {},
      };
    })
    .sort((a, b) => {
      // Your story always first
      if (a.isSelf) return -1;
      if (b.isSelf) return 1;

      // Unviewed stories before viewed stories
      if (a.isViewed && !b.isViewed) return 1;
      if (!a.isViewed && b.isViewed) return -1;

      // Sort by latest story date within each group
      const aLatest = Math.max(
        ...(a.stories?.map((s) => new Date(s.created_at)) || [0])
      );
      const bLatest = Math.max(
        ...(b.stories?.map((s) => new Date(s.created_at)) || [0])
      );
      return bLatest - aLatest;
    });

  const myStoryIndex = users.findIndex((u) => u.isSelf);
  const queryUserId = searchParams.get("userid");
  const queryUserIndex = users.findIndex((u) => u.user_id === queryUserId);

  useEffect(() => {
    const create = searchParams.get("create");
    if (create === "1") {
      setShowCreateStory(true);
    } else if (queryUserId && queryUserIndex !== -1) {
      setSelectedUser(queryUserIndex);
      setSelectedStory(0);
      setShowCreateStory(false);
    } else if (myStoryIndex !== -1) {
      setSelectedUser(myStoryIndex);
      setSelectedStory(0);
      setShowCreateStory(false);
    }
    // eslint-disable-next-line
  }, [searchParams, queryUserId, queryUserIndex, myStoryIndex, users.length]);

  const currentUser = users[selectedUser];
  const currentStory = currentUser?.stories[selectedStory];

  // Progress bar logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) setProgress(video.currentTime / video.duration);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("ended", () => setProgress(1));
    video.addEventListener("loadedmetadata", updateProgress);

    setProgress(0);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("ended", () => setProgress(1));
      video.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [currentStory?.story_id]);

  // Sync video pause/play and mute/unmute with state
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (isPaused) videoElement.pause();
    else videoElement.play().catch(() => {});
    videoElement.muted = isMuted;
  }, [isPaused, isMuted, currentStory?.story_id]);

  // Navigation handlers
  const handlePreviousStory = () => {
    if (selectedStory > 0) {
      setSelectedStory((prev) => prev - 1);
      setIsPaused(false);
    } else if (selectedUser > 0) {
      setSelectedUser((prev) => prev - 1);
      setSelectedStory(users[selectedUser - 1].stories.length - 1);
      setIsPaused(false);
    }
  };

  const handleNextStory = () => {
    if (selectedStory < (currentUser?.stories?.length || 0) - 1) {
      setSelectedStory((prev) => prev + 1);
      setIsPaused(false);
    } else if (selectedUser < users.length - 1) {
      setSelectedUser((prev) => prev + 1);
      setSelectedStory(0);
      setIsPaused(false);
    }
  };

  const togglePause = () => setIsPaused((prev) => !prev);
  const toggleMute = () => setIsMuted((prev) => !prev);
  const handlePlusClick = (e) => {
    e.stopPropagation();
    setShowCreateStory(true);
  };

  // Sidebar user list
  const displayedUserStories = users.map((user, idx) => ({
    ...user,
    isCurrentUser: user.isSelf,
    idx,
  }));

  // Combined story viewing logic
  useEffect(() => {
    if (!currentStory?.story_id || !self) return;

    // Clear existing timeout
    if (viewTimeoutRef.current) {
      clearTimeout(viewTimeoutRef.current);
    }

    // Don't start timer if:
    // 1. Story is already viewed
    // 2. Video is paused
    if (currentStory.viewed_by?.includes(self) || isPaused) {
      return;
    }

    // Set timeout for 2 seconds
    viewTimeoutRef.current = setTimeout(() => {
      dispatch(
        updateStory({
          story_id: currentStory.story_id,
          updateData: { mark_viewed: true },
        })
      )
        .unwrap()
        .then(() => {
          // Update local state to reflect the story is viewed
          const updatedUsers = users.map((user) => ({
            ...user,
            stories: user.stories.map((story) =>
              story.story_id === currentStory.story_id
                ? { ...story, viewed_by: [...(story.viewed_by || []), self] }
                : story
            ),
          }));
          setUsers(updatedUsers);
        })
        .catch((error) => console.error("Failed to mark story as viewed:", error));
    }, 2000);

    // Cleanup timeout on unmount or story change
    return () => {
      if (viewTimeoutRef.current) {
        clearTimeout(viewTimeoutRef.current);
      }
    };
  }, [currentStory?.story_id, self, isPaused, dispatch]);

  return (
    <div className="flex h-full bg-gray-100 w-full">
      {/* Sidebar */}
      {!isMobile && (
        <div className="w-70 bg-white border-r border-gray-200 flex flex-col overflow-y-scroll no-scrollbar">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Stories</h1>
            </div>
          </div>
          {/* Your Story Section */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Your story</h2>
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handlePlusClick}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full border flex items-center justify-center">
                  <img
                    className="rounded-full"
                    src={data?.profile_img_url}
                    alt={data?.username}
                  />
                  <button
                    className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-300"
                  >
                    <Plus size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Your Story</p>
                <p className="text-xs text-gray-500">
                  {users[myStoryIndex]?.stories.length === 0
                    ? "Add to story"
                    : `${users[myStoryIndex]?.stories.length} story${
                        users[myStoryIndex]?.stories.length > 1 ? "ies" : ""
                      }`}
                </p>
              </div>
            </div>
          </div>
          {/* All Stories Section */}
          <div className="flex-1">
            <div className="p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                All stories
              </h2>
              <div className="space-y-2">
                {displayedUserStories.map((user) => (
                  <div
                    key={user.user_id}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      user.idx === selectedUser
                        ? "bg-blue-50 border border-blue-200 shadow-sm"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setShowCreateStory(false);
                      setSelectedUser(user.idx);
                      setSelectedStory(0);
                    }}
                  >
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full p-0.5 ${
                          user.isViewed
                            ? "bg-gray-200"
                            : user.isCurrentUser
                            ? "bg-gradient-to-tr from-yellow-400 to-pink-600"
                            : "bg-gradient-to-tr from-yellow-400 to-pink-600"
                        }`}
                      >
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                          <img
                            className="rounded-full w-full h-full object-cover"
                            src={user.userInfo?.profile_img_url}
                            alt={user.userInfo?.username}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          user.isCurrentUser ? "text-blue-700" : "text-gray-900"
                        }`}
                      >
                        {user.isCurrentUser ? "You" : user.userInfo?.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.stories.length}{" "}
                        {user.stories.length === 1 ? "story" : "stories"}
                        {user.isViewed ? " • Viewed" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Story Viewer */}
      <div className="flex-1 flex items-center justify-center bg-gray-200 relative max-h-[calc(100vh-56px)]">
        {/* Show CreateStory if needed */}
        {showCreateStory ? (
          <div className="w-full h-full flex items-center justify-center">
            <CreateStory onClose={() => setShowCreateStory(false)} />
          </div>
        ) : (
          // Story Container
          <div
            className={`relative bg-black md:rounded-lg overflow-hidden shadow-xl ${
              isMobile
                ? "w-full h-[calc(100vh-112px)]"
                : "w-96  max-h-[calc(100vh-56px)]"
            }`}
            style={{
              aspectRatio: !isMobile && "9/16",
              height: !isMobile && "720px",
            }}
          >
            {/* Story Progress Bars */}
            <div className="absolute top-4 left-4 right-4 z-20 flex space-x-1">
              {(currentUser?.stories || []).map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-red-500 transition-all duration-150`}
                    style={{
                      width:
                        index < selectedStory
                          ? "100%"
                          : index === selectedStory
                          ? `${Math.round(progress * 100)}%`
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Header */}
            <div className="absolute top-8 left-0 right-0 z-20 p-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <img
                      className="rounded-full"
                      src={currentUser?.stories[selectedStory]?.user?.profile_img_url}
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {currentUser?.isSelf
                        ? "You"
                        : currentUser?.stories[selectedStory]?.user?.username}
                    </p>
                    <p className="text-white/80 text-xs">
                      {currentStory?.created_at
                        ? getTimeAgo(currentStory.created_at)
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={togglePause}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4 text-white" />
                    ) : (
                      <Pause className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white/60" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Story Video Content */}
            <div className="w-full h-full relative">
              {currentStory?.video_url ? (
                <video
                  ref={videoRef}
                  key={currentStory.story_id}
                  className="w-full h-full object-center object-contain md:rounded-lg"
                  autoPlay
                  playsInline
                  preload="metadata"
                  style={{ aspectRatio: "9/16" }}
                  src={currentStory.video_url}
                  onEnded={handleNextStory}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/60 rounded-full"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {currentUser?.isSelf ? "You" : currentUser?.user_id}
                    </h3>
                    <p className="text-sm opacity-90">
                      Story {selectedStory + 1} of {currentUser?.stories.length}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Invisible click areas for navigation */}
            <div className="absolute inset-0 flex">
              <div
                className="w-1/2 h-full cursor-pointer z-10"
                onClick={handlePreviousStory}
              />
              <div
                className="w-1/2 h-full cursor-pointer z-10"
                onClick={handleNextStory}
              />
            </div>

            {/* Story Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent z-20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <img className="rounded-full" src={data?.profile_img_url} alt="" />
                </div>
                <div className="flex-1 h-10 bg-white/20 rounded-full backdrop-blur-sm flex items-center px-4">
                  <span className="text-white/80 text-sm">Send message...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Navigation Buttons - Fixed positioning */}
        {!isMobile && !showCreateStory && (
          <button
            onClick={handlePreviousStory}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 z-10"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {!isMobile && !showCreateStory && (
          <button
            onClick={handleNextStory}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 z-10"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Stories;
