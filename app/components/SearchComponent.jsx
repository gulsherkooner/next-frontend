"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Search,
  ArrowLeft,
  Image,
  Video,
  Film,
  Play,
  EllipsisVertical,
  Clock,
  Heart,
  User,
} from "lucide-react";
import {
  searchPosts,
  searchPostsByType,
  searchSuggestions,
} from "../features/search/searchslice";
import Post from "./postComponents/Post";
import VideoView from "./postComponents/VideoView";
import ReelItem from "./reelComponents/ReelItem";
import getCount from "../lib/utils/getCount";
import { useIsMobile } from "../hooks/use-mobile";
import getTimeAgo from "../lib/utils/getTimeAgo";

const SearchComponent = ({ initialQuery = "", initialType = "posts" }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  // State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialType);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Refs
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Debounced search function for mobile suggestions
  const debouncedSearch = useCallback(
    (searchValue) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (searchValue.trim() && searchValue.length > 0) {
          setIsLoadingSuggestions(true);
          setShowSuggestions(true); // Force show suggestions

          try {
            // Fetch all content types like in Header component
            const allSuggestions = [];

            // Get suggestions for each content type
            const contentTypes = [
              { type: "posts", postType: "image" },
              { type: "videos", postType: "video" },
              { type: "reels", postType: "reel" },
              { type: "users", postType: "users" },
            ];

            const suggestionPromises = contentTypes.map(
              async ({ type, postType }) => {
                try {
                  const result = await dispatch(
                    searchSuggestions({
                      q: searchValue.trim(),
                      activeTab: type,
                      limit: 2,
                    })
                  ).unwrap();
                  return result.suggestions || [];
                } catch (error) {
                  console.error(
                    `SearchComponent: ${type} suggestions error:`,
                    error
                  );
                  return [];
                }
              }
            );

            const suggestionResults = await Promise.all(suggestionPromises);

            // Flatten and combine all suggestions
            suggestionResults.forEach((suggestions) => {
              if (Array.isArray(suggestions)) {
                allSuggestions.push(...suggestions);
              }
            });

            // Remove duplicates and limit total results
            const uniqueSuggestions = allSuggestions
              .filter(
                (item, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      (t.post_id && t.post_id === item.post_id) ||
                      (t.user_id && t.user_id === item.user_id)
                  )
              )
              .slice(0, 8);

            setSuggestions(uniqueSuggestions);
            setShowSuggestions(true); // Keep showing
          } catch (error) {
            console.error("SearchComponent: Search suggestions error:", error);
            setSuggestions([]);
          } finally {
            setIsLoadingSuggestions(false);
          }
        } else {
          console.log("SearchComponent: Clearing suggestions"); // Debug
          setSuggestions([]);
          setShowSuggestions(false);
          setIsLoadingSuggestions(false);
        }
      }, 300);
    },
    [dispatch] // Remove activeTab from dependencies to avoid issues
  );

  // Handle search
  const handleSearch = async (
    query = searchQuery,
    type = activeTab,
    pageNum = 1,
    append = false
  ) => {
    const searchQuery = query.trim() || "~";

    setIsLoading(true);
    try {
      let result;

      if (type === "posts") {
        result = await dispatch(
          searchPostsByType({
            q: searchQuery,
            post_type: "image",
            page: pageNum,
            limit: 20,
          })
        ).unwrap();
      } else if (type === "videos") {
        result = await dispatch(
          searchPostsByType({
            q: searchQuery,
            post_type: "video",
            page: pageNum,
            limit: 20,
          })
        ).unwrap();
      } else if (type === "reels") {
        result = await dispatch(
          searchPostsByType({
            q: searchQuery,
            post_type: "reel",
            page: pageNum,
            limit: 20,
          })
        ).unwrap();
      } else if (type === "users") {
        result = await dispatch(
          searchPostsByType({
            q: searchQuery,
            post_type: "users",
            page: pageNum,
            limit: 20,
          })
        ).unwrap();
      }


      if (result && (result.posts || result.users)) {
        const resultData = result.posts || result.users || [];
        if (append) {
          setSearchResults((prev) => [...prev, ...resultData]);
        } else {
          setSearchResults(resultData);
        }

        const totalResults = resultData.length;
        setHasMore(totalResults === 20);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input changes for suggestions (mobile only)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Always show suggestions when typing
    if (value.trim().length > 0) {
      setShowSuggestions(true);
    }

    // Call debounced search for suggestions
    debouncedSearch(value);
  };

  // Handle search submit (mobile only)
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      setShowSuggestions(false);
      setPage(1);
      handleSearch(searchQuery, activeTab, 1, false);

      if (searchQuery.trim()) {
        router.push(
          `/search?q=${encodeURIComponent(
            searchQuery.trim()
          )}&type=${activeTab}`
        );
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Close suggestions immediately
    setShowSuggestions(false);
    setIsLoadingSuggestions(false);
    setSuggestions([]); // Clear suggestions array

    if (suggestion.type === "user") {
      // Navigate to user profile
      router.push(`/${suggestion.user_id}`);
    } else {
      // For posts, use the title or description as search query
      let query = "";
      let postType = "posts";

      // Determine query - prefer title, fall back to description
      if (suggestion.title && suggestion.title.trim()) {
        query = suggestion.title.trim();
      } else if (suggestion.description && suggestion.description.trim()) {
        query = suggestion.description.trim().substring(0, 50); // Limit length
      } else {
        query = searchQuery.trim(); // Use current search query
      }

      // Determine the correct post type
      if (suggestion.post_type === "image") {
        postType = "posts";
      } else if (suggestion.post_type === "video" && suggestion.is_reel) {
        postType = "reels";
      } else if (suggestion.post_type === "video" && !suggestion.is_reel) {
        postType = "videos";
      }

      // Update search query state
      setSearchQuery(query);

      // Navigate with both query and type
      router.push(`/search?q=${encodeURIComponent(query)}&type=${postType}`);
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setPage(1);
      setSearchResults([]);
      handleSearch(searchQuery, tab, 1, false);

      const query = searchQuery.trim() || "~";
      router.push(`/search?q=${encodeURIComponent(query)}&type=${tab}`);
    }
  };

  // Load more results
  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      handleSearch(searchQuery, activeTab, nextPage, true);
    }
  };

  // Handle click outside to close suggestions (mobile only)
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Update when props change
  useEffect(() => {
    if (initialQuery !== searchQuery || initialType !== activeTab) {
      setSearchQuery(initialQuery);
      setActiveTab(initialType);
      setPage(1);
      setSearchResults([]);

      const queryToSearch = initialQuery || "~";
      handleSearch(queryToSearch, initialType, 1, false);
    }
  }, [initialQuery, initialType]);

  // Initial search on component mount
  useEffect(() => {
    const query = initialQuery || "~";
    const type = initialType;

    setActiveTab(type);
    handleSearch(query, type, 1, false);
  }, []);

  const tabs = [
    { id: "posts", label: "Posts", icon: Image },
    { id: "videos", label: "Videos", icon: Video },
    { id: "reels", label: "Reels", icon: Film },
    { id: "users", label: "Users", icon: User }, // Add this line
  ];

  return (
    <div className="flex-1 bg-white">
      {/* Mobile Search Header - Only show on mobile */}
      {isMobile && (
        <div className="bg-white border-b border-gray-200 sticky top-14 z-10 lg:hidden">
          <div className="px-4 py-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <ArrowLeft size={20} className="text-neutral-700" />
              </button>

              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-neutral-700 z-10"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search posts, videos, reels, users..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchSubmit}
                  onFocus={() => {
                    // Show suggestions if we have any and there's a search query
                    if (
                      suggestions.length > 0 &&
                      searchQuery.trim().length > 0
                    ) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Add a small delay to allow for suggestion clicks
                    setTimeout(() => {
                      setShowSuggestions(false);
                    }, 150);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />

                {/* Mobile Search Suggestions Dropdown */}
                {showSuggestions &&
                  (suggestions.length > 0 || isLoadingSuggestions) && (
                    <div
                      ref={suggestionsRef}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto"
                      style={{
                        zIndex: 9999,
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                      }}
                    >
                      {isLoadingSuggestions ? (
                        <div className="p-3 text-gray-600 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            Loading suggestions...
                          </div>
                        </div>
                      ) : suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                          <div
                            key={`${
                              suggestion.type === "user"
                                ? suggestion.user_id
                                : suggestion.post_id
                            }-${index}`}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            {/* Your existing suggestion content */}
                            <div className="flex items-center gap-3">
                              {suggestion.type === "user" ? (
                                <>
                                  <img
                                    src={
                                      suggestion.profile_img_url ||
                                      "/default-avatar.png"
                                    }
                                    alt={suggestion.username}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-gray-900 line-clamp-1 flex items-center gap-1">
                                      {suggestion.name || suggestion.username}
                                      {suggestion.is_verified && (
                                        <svg
                                          className="w-3 h-3 text-blue-600"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      @{suggestion.username}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-400 bg-blue-100 px-2 py-1 rounded">
                                    User
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    {suggestion.post_type === "video" ? (
                                      suggestion.is_reel ? (
                                        <div className="w-4 h-4 bg-purple-600 rounded"></div>
                                      ) : (
                                        <div className="w-4 h-4 bg-red-600 rounded"></div>
                                      )
                                    ) : (
                                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-gray-900 line-clamp-1">
                                      {suggestion.title || "Untitled"}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      by{" "}
                                      {suggestion.user?.username || "Unknown"}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded capitalize">
                                    {suggestion.is_reel
                                      ? "Reel"
                                      : suggestion.post_type}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      ) : searchQuery.trim().length > 0 ? (
                        <div className="p-3 text-gray-600 text-center">
                          No suggestions found
                        </div>
                      ) : (
                        <div className="p-3 text-gray-600 text-center">
                          Start typing to see suggestions
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header - Show search info only */}
      {!isMobile && (
        <div className="bg-white border-b border-gray-200 sticky top-14 z-20 hidden lg:block">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <ArrowLeft size={20} className="text-gray-700" />
              </button>

              <div className="flex-1">
                <h1 className="text-xl font-semibold text-gray-900">
                  {searchQuery && searchQuery !== "~" ? (
                    <span>Search results for "{searchQuery}"</span>
                  ) : (
                    <span>Explore {activeTab}</span>
                  )}
                </h1>
                <p className="text-sm text-gray-600">
                  {searchQuery && searchQuery !== "~" ? (
                    <span>Found results in {activeTab}</span>
                  ) : (
                    <span>
                      Browse all {activeTab} or use the search bar to find
                      specific content
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-2 py-3 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full font-medium text-xs transition-colors ${
                    activeTab === tab.id
                      ? " border-2 border-blue-500 text-blue-600 bg-gray-200"
                      : "border-1 text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-4xl mx-auto md:px-4 py-6">
        {isLoading && searchResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {searchQuery && searchQuery !== "~"
                ? "Searching..."
                : `Loading ${activeTab}...`}
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-6">
            {/* Results Grid */}
            {activeTab === "posts" && (
              <div className="space-y-6 md:max-w-xl">
                {searchResults.map((post) => (
                  <Post
                    key={post.post_id}
                    post_id={post.post_id}
                    created_at={post.created_at}
                    description={post.description}
                    url={post.url}
                    likes_count={post.likes_count}
                    comments_count={post.comments_count}
                    post_type={post.post_type}
                    user={post.user}
                    title={post.title}
                    user_id={post.user_id}
                    is_reel={post.is_reel}
                  />
                ))}
              </div>
            )}

            {activeTab === "videos" && (
              <div className="grid grid-cols-1 px-3 md:px-0 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {searchResults.map((post) => (
                  <div
                    onClick={() => router.push(`/post/${post?.post_id}`)}
                    key={post.post_id}
                    className="overflow-hidden bg-gray-50 rounded-md shadow"
                  >
                    <div className="relative aspect-video bg-gray-300 overflow-hidden group cursor-pointer">
                      {/* Use a placeholder image for the video thumbnail */}
                      {/* <div 
                        className="absolute inset-0 bg-cover bg-center" 
                        style={{ 
                          backgroundImage: `url(https://source.unsplash.com/random/?tech,${video.id})` 
                        }}
                      /> */}
                      <video
                        src={post.url[0]}
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
                        {post?.duration}
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
                        <span className="ml-1 text-xs">
                          {post?.views_count}
                        </span>
                      </div>
                    </div>

                    <div className="px-3 py-1.5">
                      <div className="">
                        <h3 className="text-sm font-medium mb-1 flex justify-between items-center">
                          <span className="truncate pr-2">{post.title}</span>
                          <button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"
                          >
                            <EllipsisVertical size={18} color="gray" />
                          </button>
                        </h3>
                        {/* <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                          {post.description}
                        </p> */}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Heart size={16} color="gray" />
                          &nbsp;
                          <span className="">
                            {post.likes_count}&nbsp;&nbsp;•&nbsp;&nbsp;
                          </span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{getTimeAgo(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reels" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((post, index) => (
                  <ReelItem
                    key={post.post_id}
                    reel={post}
                    isActive={index === 0}
                    isLiked={false}
                    setIsLiked={() => {}}
                    isSaved={false}
                    setIsSaved={() => {}}
                    formatCount={getCount}
                    showComments={false}
                    setShowComments={() => {}}
                  />
                ))}
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-4">
                {searchResults.map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => router.push(`/${user.user_id}`)}
                    className="bg-gray-50 rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={user.profile_img_url || "/default-avatar.png"}
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {user.is_verified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-900 truncate">
                            {user.name || user.username}
                          </h3>
                          {user.is_verified && (
                            <svg
                              className="w-4 h-4 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          @{user.username}
                        </p>
                        {user.bio && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {user.bio}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{user.followers || 0} followers</span>
                          <span>{user.following || 0} following</span>
                          <span>Joined {getTimeAgo(user.created_at)}</span>
                        </div>
                      </div>

                      {/* <button
                        onClick={(e) => {
                          // e.stopPropagation();
                          // Add follow/unfollow logic here
                        }}
                        className="px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                      >
                        Follow
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            {searchQuery && searchQuery !== "~" ? (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try different keywords or check your spelling
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {!isMobile ? `No ${activeTab} available` : "Start searching"}
                </h3>
                <p className="text-gray-600">
                  {!isMobile
                    ? `No ${activeTab} found. Try uploading some content or search for specific ${activeTab}.`
                    : `Search for ${
                        activeTab === "users" ? "users" : activeTab
                      } and other content`}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
