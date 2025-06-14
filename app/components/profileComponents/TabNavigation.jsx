import { useIsMobile } from '@/app/hooks/use-mobile';
import { BadgeCheck } from 'lucide-react';
import React from 'react';


const TabNavigation = ({ activeTab, setActiveTab }) => {
  
  const isMobile = useIsMobile();

  return (
    <div className="border-b border-gray-200">
      <div className={`flex ${isMobile ? "space-x-0" : "space-x-8"}`}>
        <TabButton 
          label="Posts" 
          active={activeTab === 'posts'} 
          onClick={() => setActiveTab('posts')} 
        />
        <TabButton 
          label="Reels" 
          active={activeTab === 'reels'} 
          onClick={() => setActiveTab('reels')} 
        />
        <TabButton 
          label="Videos" 
          active={activeTab === 'videos'} 
          onClick={() => setActiveTab('videos')} 
        />
        <TabButton 
          label="Collections" 
          active={activeTab === 'collections'} 
          onClick={() => setActiveTab('collections')} 
        />
        <TabButton 
          label="Account" 
          active={activeTab === 'account'} 
          onClick={() => setActiveTab('account')} 
        />
        <div className={`ml-auto ${isMobile?"pr-0":"pr-4"} flex items-center`}>
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 py-2 flex space-x-2 overflow-x-auto">
        <FilterButton label="Latest" active={true} />
        <FilterButton label="Popular" active={false} />
        <FilterButton label="Oldest" active={false} />
        <FilterButton label={<BadgeCheck size={18} />} active={false} />
      </div>
    </div>
  );
};

const TabButton = ({ label, active, onClick }) => {
  const isMobile = useIsMobile();
  return (
    <button 
      onClick={onClick}
      className={`${isMobile ? "p-2":"p-4"} font-medium text-sm relative ${
        active ? 'text-black' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
      )}
    </button>
  );
};

const FilterButton = ({ label, active }) => {
  return (
    <button 
      className={`py-1 px-3 rounded-full text-xs ${
        active 
          ? 'bg-black text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );
};

export default TabNavigation;
