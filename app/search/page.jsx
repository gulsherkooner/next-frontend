"use client"
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SearchComponent from '../components/SearchComponent';
import { useIsMobile } from '../hooks/use-mobile';
import MobileNav from '../components/MobileNav';

const SearchPage = () => {
  const [menu, setMenu] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header setMenu={setMenu} menu={menu} />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar menu={menu} setMenu={setMenu} />
        
        {/* Main Content */}
        <div className="flex-1 pt-16 md:ml-64">
          <SearchComponent />
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default SearchPage;
