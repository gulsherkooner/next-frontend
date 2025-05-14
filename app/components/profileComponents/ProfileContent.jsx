
import React, { useState } from 'react';
import TabNavigation from './TabNavigation';
import PostsGrid from './PostsGrid';
import ReelsGrid from './ReelsGrid';
import VideosGrid from './VideosGrid'; 
import CollectionsGrid from './CollectionsGrid';
import AboutTab from './AboutTab';

const ProfileContent = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return <PostsGrid />;
      case 'reels':
        return <ReelsGrid />;
      case 'videos':
        return <VideosGrid />;
      case 'collections':
        return <CollectionsGrid />;
      case 'about':
        return <AboutTab />;
      default:
        return <PostsGrid />;
    }
  };

  return (
    <div>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderTabContent()}
    </div>
  );
};

export default ProfileContent;
