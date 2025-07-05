"use client"
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SearchComponent from '../components/SearchComponent';
import { useIsMobile } from '../hooks/use-mobile';

const SearchPage = () => {
  const [menu, setMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('posts');
  const isMobile = useIsMobile();

  // Extract query parameters from URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q') || '';
      const type = urlParams.get('type') || 'posts';
      
      setSearchQuery(q);
      setSearchType(type);
    }
  }, []);

  // Listen for URL changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleRouteChange = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q') || '';
        const type = urlParams.get('type') || 'posts';
        
        setSearchQuery(q);
        setSearchType(type);
      };

      // Listen for popstate (back/forward buttons)
      window.addEventListener('popstate', handleRouteChange);
      
      // Periodically check for URL changes (fallback)
      const interval = setInterval(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q') || '';
        const type = urlParams.get('type') || 'posts';
        
        if (q !== searchQuery || type !== searchType) {
          setSearchQuery(q);
          setSearchType(type);
        }
      }, 1000);

      return () => {
        window.removeEventListener('popstate', handleRouteChange);
        clearInterval(interval);
      };
    }
  }, [searchQuery, searchType]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header setMenu={setMenu} menu={menu} />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar menu={menu} setMenu={setMenu} />
        
        {/* Main Content */}
        <div className="flex-1 pt-16 lg:ml-64">
          <SearchComponent 
            key={`${searchQuery}-${searchType}`} // Force re-render when params change
            initialQuery={searchQuery}
            initialType={searchType}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
