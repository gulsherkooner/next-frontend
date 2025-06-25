import React, { useEffect, useRef, useState } from "react";
import { Image, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getFollowing } from "../features/sub/subslice";
import { fetchStoriesByUser } from "../features/stories/storiesslice";

const Story = ({
  username,
  imageUrl,
  isMyStory = false,
  isViewed = false,
  onMyStoryPlusClick,
  onStoryClick,
}) => (
  <div
    onClick={() => onStoryClick && onStoryClick()}
    className="flex flex-col items-center justify-center space-y-1 cursor-pointer px-2"
  >
    <div
      className={`w-16 h-16 rounded-full p-[2px] relative ${
        isViewed
          ? "bg-gray-200"
          : "bg-gradient-to-tr from-yellow-400 to-pink-600"
      }`}
    >
      <div className="bg-white p-[2px] rounded-full h-full w-full flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              className="w-full h-full object-cover rounded-full"
              alt=""
            />
          ) : (
            <Image size={20} className="text-gray-400" />
          )}
          {isMyStory && (
            <button
              className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow"
              onClick={(e) => {
                e.stopPropagation();
                onMyStoryPlusClick && onMyStoryPlusClick();
              }}
              aria-label="Add to story"
              tabIndex={0}
            >
              <Plus size={20} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
    <span className="text-xs text-center truncate w-16">{username}</span>
  </div>
);

const StoryBar = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth?.user);
  const self = data?.user_id;
  const [storiesArray, setStoriesArray] = useState([]);
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const fetchStories = async () => {
      if (!self) return;

      const myStories = await dispatch(fetchStoriesByUser(self))
        .unwrap()
        .catch(() => []);

      const followingResult = await dispatch(getFollowing(self))
        .unwrap()
        .catch(() => []);
      const followingUserIds = (followingResult || [])
        .map((f) => f.target_userid)
        .filter(Boolean);

      const followingStoriesArr = await Promise.all(
        followingUserIds.map((uid) =>
          dispatch(fetchStoriesByUser(uid))
            .unwrap()
            .catch(() => [])
        )
      );

      const userStories = [];

      // Check for your stories
      if (myStories && myStories.length > 0) {
        const hasUnviewedStories = myStories.some(
          (story) => !story.viewed_by?.includes(self)
        );

        userStories.push({
          user_id: self,
          username: data?.username || "Your Story",
          imageUrl: data?.profile_img_url || "",
          isMyStory: true,
          isViewed: !hasUnviewedStories,
        });
      }

      // Check for following users' stories
      followingStoriesArr.forEach((stories) => {
        if (stories && stories.length > 0) {
          const user = stories[0].user || {};
          const hasUnviewedStories = stories.some(
            (story) => !story.viewed_by?.includes(self)
          );

          userStories.push({
            user_id: stories[0].user_id,
            username: user.username || "user",
            imageUrl: user.profile_img_url || "",
            isMyStory: false,
            isViewed: !hasUnviewedStories,
          });
        }
      });

      if (isMounted) setStoriesArray(userStories);
    };

    fetchStories();
    return () => {
      isMounted = false;
    };
  }, [self, dispatch, data?.username, data?.profile_img_url]);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollAmount =
      direction === "left"
        ? -container.offsetWidth / 2
        : container.offsetWidth / 2;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(checkScrollPosition, 300);
  };

  const checkScrollPosition = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 5
    );
  };

  useEffect(() => {
    // Run after stories are rendered to update scroll buttons
    checkScrollPosition();
    // eslint-disable-next-line
  }, [storiesArray]);

  const handleMyStoryClick = () => {
    router.push("/stories");
  };

  const handleMyStoryPlusClick = () => {
    router.push("/stories?create=1");
  };

  // Only render the component if self exists
  return self && (
    <div className="py-0 rounded-lg mb-4 overflow-hidden relative">
      <div
        className="flex space-x-0 overflow-x-auto pb-1 no-scrollbar"
        ref={containerRef}
        onScroll={checkScrollPosition}
      >
        {storiesArray.map((story) => (
          <Story
            key={story.user_id}
            username={story.username}
            imageUrl={story.imageUrl}
            isMyStory={story.isMyStory}
            isViewed={story.isViewed}
            onMyStoryPlusClick={handleMyStoryPlusClick}
            onStoryClick={
              story.isMyStory
                ? handleMyStoryClick
                : () => router.push(`/stories?userid=${story.user_id}`)
            }
          />
        ))}
      </div>
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
  )
};

export default StoryBar;
