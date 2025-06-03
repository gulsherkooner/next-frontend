import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Volume2,
  MoreHorizontal,
  Play,
  VolumeOff,
  VolumeX,
} from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { useRouter } from "next/navigation";

const Stories = () => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedStory, setSelectedStory] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const videoRef = useRef(null);

  const [loadedUsersCount, setLoadedUsersCount] = useState(1); // Initial number of users to display
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);

  const users = [
    {
      id: 1,
      name: "User 1",
      avatar: null,
      stories: [
        {
          id: 1,
          content: "Story content 1",
          time: "10h",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        },
        {
          id: 2,
          content: "Story content 2",
          time: "8h",
          videoUrl:
            "https://dl.dropboxusercontent.com/scl/fi/s9cs6bqz4ysjfjok5odl5/tikmate.app_7488599562404236550_hd.mp4?rlkey=140osgeoqslqzhvvcz5c4x2f8&st=k44dp5ia",
        },
        {
          id: 3,
          content: "Story content 3",
          time: "5h",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        },
      ],
    },
    {
      id: 2,
      name: "User 2",
      avatar: null,
      stories: [
        {
          id: 4,
          content: "User 2 Story 1",
          time: "3h",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        },
        {
          id: 5,
          content: "User 2 Story 2",
          time: "1h",
          videoUrl:
            "https://dl.dropboxusercontent.com/scl/fi/s9cs6bqz4ysjfjok5odl5/tikmate.app_7488599562404236550_hd.mp4?rlkey=140osgeoqslqzhvvcz5c4x2f8&st=k44dp5ia",
        },
      ],
    },
    {
      id: 3,
      name: "User 3",
      avatar: null,
      stories: [
        {
          id: 6,
          content: "User 3 Story 1",
          time: "15h",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        },
        {
          id: 7,
          content: "User 3 Story 2",
          time: "12h",
          videoUrl:
            "https://dl.dropboxusercontent.com/scl/fi/s9cs6bqz4ysjfjok5odl5/tikmate.app_7488599562404236550_hd.mp4?rlkey=140osgeoqslqzhvvcz5c4x2f8&st=k44dp5ia",
        },
        {
          id: 8,
          content: "User 3 Story 3",
          time: "20h",
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        },
      ],
    },
  ];

  const currentUser = users[selectedUser];
  const currentStory = currentUser?.stories[selectedStory];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && loadedUsersCount < users.length) {
          setLoadedUsersCount(
            (prevCount) => Math.min(prevCount + 1, users.length) // Load 1 more user at a time
          );
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the target is visible
    );
    observerRef.current = observer;

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current && observerRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [loadedUsersCount, users.length]); // Re-run when isPaused or the story itself changes


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
    if (selectedStory < currentUser.stories.length - 1) {
      setSelectedStory((prev) => prev + 1);
      setIsPaused(false); 
    } else if (selectedUser < users.length - 1) {
      setSelectedUser((prev) => prev + 1);
      setSelectedStory(0);
      setIsPaused(false); 
    }
  };

  const togglePause = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isPaused) {
        videoElement.play().catch(error => {
          console.warn("Video play failed. User interaction might be required or media error.", error);
        });
      } else {
        videoElement.pause();
      }
    }
    setIsPaused(!isPaused);
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  }

  // Flatten *displayed* users for the sidebar display
  const displayedUserStories = users.slice(0, loadedUsersCount).map((user) => ({
    ...user,
    isCurrentUser: user.id === currentUser?.id, // currentUser might be undefined if users array was empty
  }));

  return (
    <div className="flex h-screen bg-gray-100 w-full">
      {/* Sidebar */}
      {!isMobile && (
        <div className="w-70 bg-white border-r border-gray-200 flex flex-col">
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
            <h2 className="text-sm font-medium text-gray-900 mb-4">
              Your story
            </h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Your Story</p>
                <p className="text-xs text-gray-500">Add to story</p>
              </div>
              <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <span className="text-gray-600 text-lg">+</span>
              </button>
            </div>
          </div>

          {/* All Stories Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-4">
                All stories
              </h2>
              <div className="space-y-2">
                {displayedUserStories.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      user.isCurrentUser
                        ? "bg-blue-50 border border-blue-200 shadow-sm"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      const originalUserIndex = users.findIndex(
                        (u) => u.id === user.id
                      );
                      if (originalUserIndex !== -1) {
                        setSelectedUser(originalUserIndex);
                      }
                      setSelectedStory(0);
                    }}
                  >
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full p-0.5 ${
                          user.isCurrentUser
                            ? "bg-gradient-to-br from-blue-500 to-purple-500"
                            : "bg-gradient-to-br from-purple-400 to-pink-400"
                        }`}
                      >
                        <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          user.isCurrentUser ? "text-blue-700" : "text-gray-900"
                        }`}
                      >
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.stories.length} stories
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {loadedUsersCount < users.length && (
                <div
                  ref={loadMoreRef}
                  style={{ height: "1px", marginTop: "10px" }}
                >
                  {/* This div triggers loading more users when it becomes visible */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Story Viewer */}
      <div className="flex-1 flex items-center justify-center bg-gray-200 relative">
        {/* Story Container */}
        <div
          className={`relative bg-black rounded-lg overflow-hidden shadow-xl ${
            isMobile ? "w-full h-[calc(100vh-112px)]" : "w-96"
          }`}
          style={{
            aspectRatio: !isMobile && "9/16",
            height: !isMobile && "720px",
          }}
        >
          {/* Story Progress Bars - Shows progress for current user's stories */}
          <div className="absolute top-4 left-4 right-4 z-20 flex space-x-1">
            {currentUser.stories.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full bg-red-500 transition-all duration-300 ${
                    index < selectedStory
                      ? "w-full"
                      : index === selectedStory
                      ? "w-1/2"
                      : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Story Header */}
          <div className="absolute top-8 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent p-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {currentUser?.name}
                  </p>
                  <p className="text-white/80 text-xs">{currentStory?.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePause}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isPaused ? (<Play className="w-4 h-4 text-white" />) : (<Pause className="w-4 h-4 text-white" />)}
                </button>
                <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-full transition-colors">
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
            {currentStory?.videoUrl ? (
              <video
              ref={videoRef}
                key={currentStory.id}
                className="w-full h-full object-center object-contain md:rounded-lg"
                autoPlay
                loop
                playsInline
                preload="metadata"
                style={{ aspectRatio: "9/16" }}
              >
                <source src={currentStory.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/60 rounded-full"></div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {currentUser?.name}
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
                <div className="w-4 h-4 bg-white/60 rounded-full"></div>
              </div>
              <div className="flex-1 h-10 bg-white/20 rounded-full backdrop-blur-sm flex items-center px-4">
                <span className="text-white/80 text-sm">Send message...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Fixed positioning */}
        {!isMobile && (
          <button
            onClick={handlePreviousStory}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 z-10"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {!isMobile && (
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
