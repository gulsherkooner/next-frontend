"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Search, ArrowLeft, Image, Video, Film } from 'lucide-react';
import { searchPosts, searchPostsByType, searchSuggestions } from '../features/search/searchslice';
import Post from './postComponents/Post';
import VideoView from './postComponents/VideoView';
import ReelItem from './reelComponents/ReelItem';
import getCount from '../lib/utils/getCount';
import { useIsMobile } from '../hooks/use-mobile';

const SearchComponent = ({ initialQuery = '', initialType = 'posts' }) => {
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
        if (searchValue.trim().length > 0) {
          setIsLoadingSuggestions(true);
          try {
            const result = await dispatch(searchSuggestions({ 
              q: searchValue.trim(), 
              limit: 5 
            })).unwrap();
            
            if (result && result.suggestions) {
              setSuggestions(result.suggestions);
              setShowSuggestions(true);
            }
          } catch (error) {
            console.error('Search suggestions error:', error);
            setSuggestions([]);
          } finally {
            setIsLoadingSuggestions(false);
          }
        } else {
          setShowSuggestions(false);
          setSuggestions([]);
          setIsLoadingSuggestions(false);
        }
      }, 300);
    },
    [dispatch]
  );

  // Handle search
  const handleSearch = async (query = searchQuery, type = activeTab, pageNum = 1, append = false) => {
    const searchQuery = query.trim() || "~";
    
    setIsLoading(true);
    try {
      let result;
      
      if (type === 'posts') {
        result = await dispatch(searchPostsByType({ 
          q: searchQuery, 
          post_type: 'image', 
          page: pageNum, 
          limit: 20 
        })).unwrap();
      } else if (type === 'videos') {
        result = await dispatch(searchPostsByType({ 
          q: searchQuery, 
          post_type: 'video', 
          page: pageNum, 
          limit: 20 
        })).unwrap();
      } else if (type === 'reels') {
        result = await dispatch(searchPostsByType({ 
          q: searchQuery, 
          post_type: 'reel', 
          page: pageNum, 
          limit: 20 
        })).unwrap();
      }
      
      console.log('Search result:', result);
      
      if (result && result.posts) {
        if (append) {
          setSearchResults(prev => [...prev, ...result.posts]);
        } else {
          setSearchResults(result.posts);
        }
        
        const totalResults = result.posts.length;
        setHasMore(totalResults === 20);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input changes for suggestions (mobile only)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Call debounced search for suggestions
    debouncedSearch(value);
  };

  // Handle search submit (mobile only)
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      setShowSuggestions(false);
      setPage(1);
      handleSearch(searchQuery, activeTab, 1, false);
      
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&type=${activeTab}`);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    const query = suggestion.title || suggestion.description || '';
    setSearchQuery(query);
    setShowSuggestions(false);
    setPage(1);
    handleSearch(query, activeTab, 1, false);
    router.push(`/search?q=${encodeURIComponent(query)}&type=${activeTab}`);
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    console.log('Props changed:', { initialQuery, initialType });
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
    { id: 'posts', label: 'Posts', icon: Image },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'reels', label: 'Reels', icon: Film }
  ];

  return (
    <div className="flex-1 bg-gray-50">
      {/* Mobile Search Header - Only show on mobile */}
      {isMobile && (
        <div className="bg-white border-b border-gray-200 sticky top-14 z-10 lg:hidden">
          <div className="px-4 py-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
              
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400 z-10" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search posts, videos, reels..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchSubmit}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {/* Mobile Search Suggestions Dropdown */}
                {showSuggestions && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto z-50"
                  >
                    {isLoadingSuggestions ? (
                      <div className="p-3 text-gray-500 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                          Loading suggestions...
                        </div>
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <div
                          key={`${suggestion.post_id}-${index}`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              {suggestion.post_type === 'video' ? (
                                <Video size={16} className="text-gray-600" />
                              ) : suggestion.is_reel ? (
                                <Film size={16} className="text-gray-600" />
                              ) : (
                                <Image size={16} className="text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900 line-clamp-1">
                                {suggestion.title || 'Untitled'}
                              </div>
                              <div className="text-xs text-gray-500">
                                by {suggestion.user?.username || 'Unknown'}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 capitalize">
                              {suggestion.is_reel ? 'Reel' : suggestion.post_type}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">No suggestions found</div>
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
                    <span>Browse all {activeTab} or use the search bar to find specific content</span>
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
                      ? ' border-2 border-blue-500 text-blue-600 bg-gray-200'
                      : 'border-1 text-gray-500 hover:text-gray-700'
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
              {searchQuery && searchQuery !== "~" ? "Searching..." : `Loading ${activeTab}...`}
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-6">
            {/* Results Grid */}
            {activeTab === 'posts' && (
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

            {activeTab === 'videos' && (
              <div className="space-y-6">
                {searchResults.map((post) => (
                  <VideoView key={post.post_id} post={post} />
                ))}
              </div>
            )}

            {activeTab === 'reels' && (
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

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
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
                  {!isMobile ? `No ${activeTab} found. Try uploading some content or search for specific ${activeTab}.` : `Search for ${activeTab} and other content`}
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