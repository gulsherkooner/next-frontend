// components/Header.jsx
"use client"
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Home, Bell, Mail, User, Wallet, Menu, Heart } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "../hooks/use-mobile";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { searchSuggestions } from '../features/search/searchslice';

const Header = ({ setMenu, menu }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchValue) => {
      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout
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
      }, 300); // 300ms delay
    },
    [dispatch]
  );

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Call debounced search
    debouncedSearch(value);
  };

  // Handle search submit (Enter key)
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Clear any pending debounced calls
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    // Clear any pending debounced calls
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    const query = suggestion.title || suggestion.description || '';
    setSearchQuery(query);
    setShowSuggestions(false);
    setIsLoadingSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
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
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleMenu = () => {
    setMenu(!menu);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-[#b4b4b4] z-30">
      <div className="flex items-center justify-between px-2 md:px-4 xl:px-4 2xl:px-4 h-full max-w-screen mx-auto">
        
        {/* Left section - User avatar and search */}
        <div className="flex items-center gap-3 flex-1">
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-gray-900" />
          </button>

          {isMobile && (
            <h2 className="text-lg font-semibold text-gray-800">App name</h2>
          )}

          {/* Desktop Search Bar */}
          {!isMobile && (
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-500 z-10" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleSearchSubmit}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                className="w-[40vw] pl-10 pr-4 py-2 border bg-white border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Search Suggestions Dropdown */}
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
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={16} className="text-gray-600" />
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
                  ) : searchQuery.trim().length > 0 ? (
                    <div className="p-3 text-gray-500 text-center">No suggestions found</div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center section - Navigation Icons (Desktop only) */}
        {!isMobile && (
          <div className="flex items-center gap-0">
            <Link
              href="/"
              className={`w-20 h-14 flex items-center justify-center text-gray-900 hover:text-gray-800 transition-colors ${
                pathname === '/' ? 'bg-white/20 border-b-2 border-black' : ''
              }`}
            >
              <Home size={24} />
            </Link>
            <Link
              href="/dating"
              className={`w-20 h-14 flex items-center justify-center text-gray-900 hover:text-gray-800 transition-colors ${
                pathname === '/dating' ? 'bg-white/20 border-b-2 border-black' : ''
              }`}
            >
              <Heart size={24} />
            </Link>
          </div>
        )}

        {/* Right section - Action Icons */}
        <div className={`flex items-center ${isMobile ? "gap-2" : "gap-3"} flex-shrink-0`}>
          {/* Desktop Wallet */}
          {!isMobile && (
            <button 
              className={`w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors ${
                pathname === '/Wallet' ? 'border-2 border-black' : ''
              }`}
              onClick={() => router.push('/Wallet')}
            >
              <Wallet size={20} className="text-gray-900" />
            </button>
          )}

          {/* Mobile Search Button */}
          {isMobile && (
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={() => router.push('/search')}
            >
              <Search size={20} className="text-gray-900" />
            </button>
          )}

          {/* Messages */}
          <button 
            className={`w-10 h-10 rounded-full ${!isMobile ? "bg-white hover:bg-gray-100" : "hover:bg-white/20"} flex items-center justify-center transition-colors`}
            onClick={() => router.push('/dating/messages')}
          >
            <Mail size={20} className="text-gray-900" />
          </button>

          {/* Notifications */}
          <button className={`w-10 h-10 rounded-full ${!isMobile ? "bg-white hover:bg-gray-100" : "hover:bg-white/20"} flex items-center justify-center transition-colors`}>
            <Bell size={20} className="text-gray-900" />
          </button>

          {/* Mobile Menu / Desktop Profile */}
          {isMobile ? (
            <button
              onClick={handleMenu}
              data-menu-toggle="true"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Menu size={20} className="text-gray-900" />
            </button>
          ) : (
            <button 
              className={`w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors ${
                pathname === '/profile' ? 'border-2 border-black' : ''
              }`} 
              onClick={() => router.push("/profile")}
            >
              <User size={20} className="text-gray-900" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;